import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import sql from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure reports directory exists
const reportsDir = path.join(__dirname, '../../uploads/reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

class ExcelService {
  /**
   * Export goats to Excel
   */
  async exportGoatsToExcel() {
    try {
      const goats = await sql`
        SELECT goat_id, tag_number, breed, sex, date_of_birth, color_markings,
               weight_kg, status, purpose, source, date_acquired, location
        FROM goats
        ORDER BY goat_id DESC
      `;

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(goats);

      // Set column widths
      worksheet['!cols'] = [
        { wch: 8 }, { wch: 15 }, { wch: 15 }, { wch: 8 }, { wch: 12 },
        { wch: 20 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 15 },
        { wch: 12 }, { wch: 15 }
      ];

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Goats');

      const fileName = `goats-export-${Date.now()}.xlsx`;
      const filePath = path.join(__dirname, '../../uploads/reports', fileName);

      XLSX.writeFile(workbook, filePath);

      return { fileName, filePath };
    } catch (error) {
      console.error('Error in exportGoatsToExcel:', error);
      throw new Error(`Failed to export goats: ${error.message}`);
    }
  }

  /**
   * Export monthly summaries to Excel
   */
  async exportMonthlySummariesToExcel(year) {
    try {
      let query;
      if (year) {
        const yearStr = `${year}%`;
        query = await sql`
          SELECT * FROM monthly_summary 
          WHERE month LIKE ${yearStr}
          ORDER BY month DESC
        `;
      } else {
        query = await sql`
          SELECT * FROM monthly_summary 
          ORDER BY month DESC
        `;
      }

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(query);

      worksheet['!cols'] = [
        { wch: 8 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
        { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 15 },
        { wch: 15 }, { wch: 15 }
      ];

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Monthly Summary');

      const fileName = `monthly-summaries-${year || 'all'}-${Date.now()}.xlsx`;
      const filePath = path.join(__dirname, '../../uploads/reports', fileName);

      XLSX.writeFile(workbook, filePath);

      return { fileName, filePath };
    } catch (error) {
      console.error('Error in exportMonthlySummariesToExcel:', error);
      throw new Error(`Failed to export monthly summaries: ${error.message}`);
    }
  }

  /**
   * Export sales to Excel
   */
  async exportSalesToExcel() {
    try {
      const [breedingSales, meatSales] = await Promise.all([
        sql`SELECT * FROM sales_breeding ORDER BY sale_date DESC`,
        sql`SELECT * FROM sales_meat ORDER BY sale_date DESC`
      ]);

      const workbook = XLSX.utils.book_new();

      // Breeding sales sheet
      const breedingSheet = XLSX.utils.json_to_sheet(breedingSales);
      breedingSheet['!cols'] = Array(10).fill({ wch: 15 });
      XLSX.utils.book_append_sheet(workbook, breedingSheet, 'Breeding Sales');

      // Meat sales sheet
      const meatSheet = XLSX.utils.json_to_sheet(meatSales);
      meatSheet['!cols'] = Array(10).fill({ wch: 15 });
      XLSX.utils.book_append_sheet(workbook, meatSheet, 'Meat Sales');

      const fileName = `sales-export-${Date.now()}.xlsx`;
      const filePath = path.join(__dirname, '../../uploads/reports', fileName);

      XLSX.writeFile(workbook, filePath);

      return { fileName, filePath };
    } catch (error) {
      console.error('Error in exportSalesToExcel:', error);
      throw new Error(`Failed to export sales: ${error.message}`);
    }
  }

  /**
   * Export health records to Excel
   */
  async exportHealthRecordsToExcel() {
    try {
      const records = await sql`
        SELECT hr.*, g.tag_number as goat_tag
        FROM health_records hr
        LEFT JOIN goats g ON hr.goat_id = g.goat_id
        ORDER BY hr.treatment_date DESC
      `;

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(records);
      worksheet['!cols'] = Array(10).fill({ wch: 15 });

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Health Records');

      const fileName = `health-records-${Date.now()}.xlsx`;
      const filePath = path.join(__dirname, '../../uploads/reports', fileName);

      XLSX.writeFile(workbook, filePath);

      return { fileName, filePath };
    } catch (error) {
      console.error('Error in exportHealthRecordsToExcel:', error);
      throw new Error(`Failed to export health records: ${error.message}`);
    }
  }
}

export default new ExcelService();
