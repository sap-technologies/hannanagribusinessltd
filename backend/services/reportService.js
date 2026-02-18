import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sql from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure reports directory exists
const reportsDir = path.join(__dirname, '../../uploads/reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Path to logo (you need to copy logo.png to backend/assets folder)
const logoPath = path.join(__dirname, '../assets/logo.png');

class ReportService {
  /**
   * Add company header with logo to PDF
   */
  addCompanyHeader(doc, title, subtitle = null) {
    const logoExists = fs.existsSync(logoPath);
    
    if (logoExists) {
      try {
        // Add logo centered at top
        const logoWidth = 60;
        const logoHeight = 60;
        const pageWidth = doc.page.width;
        const logoX = (pageWidth - logoWidth) / 2;
        
        doc.image(logoPath, logoX, 50, {
          width: logoWidth,
          height: logoHeight,
          align: 'center'
        });
        
        doc.moveDown(4);
      } catch (error) {
        console.warn('Failed to add logo to PDF:', error);
      }
    }
    
    // Company name
    doc.fontSize(20)
       .fillColor('#1e3c72')
       .text('Hannan Agribusiness Limited', { align: 'center' });
    
    // Title
    doc.fontSize(16)
       .fillColor('#2a5298')
       .text(title, { align: 'center' });
    
    // Subtitle if provided
    if (subtitle) {
      doc.fontSize(12)
         .fillColor('#666')
         .text(subtitle, { align: 'center' });
    }
    
    doc.fillColor('#000'); // Reset color
    doc.moveDown(2);
  }

  /**
   * Add footer to PDF
   */
  addFooter(doc) {
    const bottomMargin = 50;
    const pageHeight = doc.page.height;
    
    doc.fontSize(9)
       .fillColor('#999')
       .text(
         `Generated on: ${new Date().toLocaleString()} | Hannan Agribusiness Limited`,
         50,
         pageHeight - bottomMargin,
         { align: 'center', width: doc.page.width - 100 }
       );
    
    doc.fillColor('#000'); // Reset color
  }

  /**
   * Generate PDF report for monthly summary
   */
  async generateMonthlySummaryPDF(year, month) {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    
    // Get data
    const [summary] = await sql`
      SELECT * FROM monthly_summary WHERE month = ${monthStr}
    `;

    if (!summary) {
      throw new Error('No summary found for this month');
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    const fileName = `monthly-summary-${monthStr}-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../../uploads/reports', fileName);
    
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header with logo
    this.addCompanyHeader(
      doc, 
      'Monthly Summary Report',
      new Date(summary.month).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    );

    // Goat Movements
    doc.fontSize(14).text('Goat Population Movements', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11);
    doc.text(`Opening Stock: ${summary.opening_goats}`);
    doc.text(`Births: +${summary.births}`, { indent: 20 });
    doc.text(`Purchases: +${summary.purchases}`, { indent: 20 });
    doc.text(`Deaths: -${summary.deaths}`, { indent: 20 });
    doc.text(`Sold (Breeding): -${summary.sold_breeding}`, { indent: 20 });
    doc.text(`Sold (Meat): -${summary.sold_meat}`, { indent: 20 });
    doc.text(`Closing Stock: ${summary.closing_goats}`, { bold: true });
    doc.moveDown(1.5);

    // Financial Summary
    doc.fontSize(14).text('Financial Summary', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11);
    doc.text(`Total Income: UGX ${parseInt(summary.total_income_ugx).toLocaleString()}`, { color: 'green' });
    doc.text(`Total Expenses: UGX ${parseInt(summary.total_expenses_ugx).toLocaleString()}`, { color: 'red' });
    doc.text(`Net Profit: UGX ${parseInt(summary.net_profit_ugx).toLocaleString()}`, { 
      bold: true,
      color: summary.net_profit_ugx >= 0 ? 'green' : 'red'
    });

    // Footer
    this.addFooter(doc);

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve({ fileName, filePath }));
      stream.on('error', reject);
    });
  }

  /**
   * Generate PDF report for all goats
   */
  async generateGoatsListPDF() {
    const goats = await sql`
      SELECT * FROM goats ORDER BY goat_id DESC
    `;

    const doc = new PDFDocument({ margin: 50, size: 'A4', layout: 'landscape' });
    const fileName = `goats-list-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../../uploads/reports', fileName);
    
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header with logo
    this.addCompanyHeader(doc, 'Complete Goats Inventory');

    // Table header
    doc.fontSize(10);
    const startY = doc.y;
    doc.text('Tag', 50, startY, { width: 80 });
    doc.text('Breed', 130, startY, { width: 100 });
    doc.text('Sex', 230, startY, { width: 50 });
    doc.text('DOB', 280, startY, { width: 80 });
    doc.text('Age', 360, startY, { width: 60 });
    doc.text('Status', 420, startY, { width: 80 });
    doc.text('Purpose', 500, startY, { width: 80 });
    doc.moveDown(0.5);
    
    // Draw line
    doc.moveTo(50, doc.y).lineTo(750, doc.y).stroke();
    doc.moveDown(0.5);

    // Data rows
    goats.forEach((goat, index) => {
      const y = doc.y;
      
      if (y > 500) { // New page if needed
        doc.addPage();
        doc.fontSize(10);
        doc.text('Tag', 50, 50, { width: 80 });
        doc.text('Breed', 130, 50, { width: 100 });
        doc.text('Sex', 230, 50, { width: 50 });
        doc.text('DOB', 280, 50, { width: 80 });
        doc.text('Age', 360, 50, { width: 60 });
        doc.text('Status', 420, 50, { width: 80 });
        doc.text('Purpose', 500, 50, { width: 80 });
        doc.moveDown(1.5);
      }

      const currentY = doc.y;
      doc.text(goat.tag_number || 'N/A', 50, currentY, { width: 80 });
      doc.text(goat.breed || 'N/A', 130, currentY, { width: 100 });
      doc.text(goat.sex || 'N/A', 230, currentY, { width: 50 });
      doc.text(goat.date_of_birth ? new Date(goat.date_of_birth).toLocaleDateString() : 'N/A', 280, currentY, { width: 80 });
      
      // Calculate age
      if (goat.date_of_birth) {
        const age = Math.floor((new Date() - new Date(goat.date_of_birth)) / (1000 * 60 * 60 * 24 * 30.44));
        doc.text(`${age}m`, 360, currentY, { width: 60 });
      } else {
        doc.text('N/A', 360, currentY, { width: 60 });
      }
      
      doc.text(goat.status || 'N/A', 420, currentY, { width: 80 });
      doc.text(goat.purpose || 'N/A', 500, currentY, { width: 80 });
      doc.moveDown(0.8);
    });

    doc.moveDown(1);
    doc.fontSize(9).text(`Total Goats: ${goats.length}`, { align: 'right' });
    
    // Footer
    this.addFooter(doc);

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve({ fileName, filePath }));
      stream.on('error', reject);
    });
  }

  /**
   * Generate PDF report for health records summary
   */
  async generateHealthSummaryPDF() {
    const healthRecords = await sql`
      SELECT hr.*, g.tag_number as goat_tag, g.breed
      FROM health_records hr
      LEFT JOIN goats g ON hr.goat_id = g.goat_id
      ORDER BY hr.treatment_date DESC
      LIMIT 100
    `;

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const fileName = `health-summary-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../../uploads/reports', fileName);
    
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header with logo
    this.addCompanyHeader(doc, 'Health Records Summary');

    // Summary statistics
    const [stats] = await sql`
      SELECT 
        COUNT(*) as total_records,
        COUNT(DISTINCT goat_id) as goats_treated,
        SUM(CAST(cost_ugx AS DECIMAL)) as total_cost
      FROM health_records
    `;

    doc.fontSize(12);
    doc.text(`Total Health Records: ${stats.total_records}`);
    doc.text(`Goats Treated: ${stats.goats_treated}`);
    doc.text(`Total Health Costs: UGX ${parseInt(stats.total_cost || 0).toLocaleString()}`);
    doc.moveDown(1);

    // Recent records
    doc.fontSize(14).text('Recent Health Records', { underline: true });
    doc.moveDown(0.5);

    healthRecords.forEach((record, index) => {
      if (doc.y > 700) {
        doc.addPage();
      }

      doc.fontSize(11);
      doc.text(`${index + 1}. Goat: ${record.goat_tag} (${record.breed || 'N/A'})`, { bold: true });
      doc.fontSize(10);
      doc.text(`   Date: ${new Date(record.treatment_date).toLocaleDateString()}`);
      doc.text(`   Issue: ${record.health_issue}`);
      doc.text(`   Treatment: ${record.treatment}`);
      if (record.vet_name) {
        doc.text(`   Vet: ${record.vet_name}`);
      }
      doc.text(`   Cost: UGX ${parseInt(record.cost_ugx).toLocaleString()}`);
      doc.moveDown(0.5);
    });

    // Footer
    this.addFooter(doc);

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve({ fileName, filePath }));
      stream.on('error', reject);
    });
  }

  /**
   * Generate PDF report for sales summary
   */
  async generateSalesSummaryPDF(year, month) {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const startDate = `${monthStr}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    // Get breeding sales
    const breedingSales = await sql`
      SELECT * FROM sales_breeding 
      WHERE sale_date >= ${startDate} AND sale_date <= ${endDate}
      ORDER BY sale_date DESC
    `;

    // Get meat sales
    const meatSales = await sql`
      SELECT * FROM sales_meat 
      WHERE sale_date >= ${startDate} AND sale_date <= ${endDate}
      ORDER BY sale_date DESC
    `;

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const fileName = `sales-summary-${monthStr}-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../../uploads/reports', fileName);
    
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header with logo
    this.addCompanyHeader(
      doc,
      'Sales Summary Report',
      new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    );

    // Breeding Sales Summary
    doc.fontSize(14).text('Breeding Sales', { underline: true });
    doc.moveDown(0.5);
    
    if (breedingSales.length > 0) {
      const breedingTotal = breedingSales.reduce((sum, sale) => sum + parseFloat(sale.sale_price_ugx || 0), 0);
      doc.fontSize(11);
      doc.text(`Number of Sales: ${breedingSales.length}`);
      doc.text(`Total Revenue: UGX ${parseInt(breedingTotal).toLocaleString()}`, { color: 'green' });
      doc.moveDown(1);

      breedingSales.forEach((sale, index) => {
        if (doc.y > 700) doc.addPage();
        doc.fontSize(10);
        doc.text(`${index + 1}. Date: ${new Date(sale.sale_date).toLocaleDateString()}`);
        doc.text(`   Buyer: ${sale.buyer_name}`);
        doc.text(`   Amount: UGX ${parseInt(sale.sale_price_ugx).toLocaleString()}`);
        doc.moveDown(0.3);
      });
    } else {
      doc.fontSize(11).text('No breeding sales in this period.');
    }

    doc.moveDown(2);

    // Meat Sales Summary
    doc.fontSize(14).text('Meat Sales', { underline: true });
    doc.moveDown(0.5);
    
    if (meatSales.length > 0) {
      const meatTotal = meatSales.reduce((sum, sale) => sum + parseFloat(sale.sale_price_ugx || 0), 0);
      doc.fontSize(11);
      doc.text(`Number of Sales: ${meatSales.length}`);
      doc.text(`Total Revenue: UGX ${parseInt(meatTotal).toLocaleString()}`, { color: 'green' });
      doc.moveDown(1);

      meatSales.forEach((sale, index) => {
        if (doc.y > 700) doc.addPage();
        doc.fontSize(10);
        doc.text(`${index + 1}. Date: ${new Date(sale.sale_date).toLocaleDateString()}`);
        doc.text(`   Buyer: ${sale.buyer_name}`);
        doc.text(`   Weight: ${sale.weight_kg} kg`);
        doc.text(`   Amount: UGX ${parseInt(sale.sale_price_ugx).toLocaleString()}`);
        doc.moveDown(0.3);
      });
    } else {
      doc.fontSize(11).text('No meat sales in this period.');
    }

    doc.moveDown(2);

    // Grand Total
    const grandTotal = [...breedingSales, ...meatSales].reduce((sum, sale) => sum + parseFloat(sale.sale_price_ugx || 0), 0);
    doc.fontSize(14).text('Grand Total', { underline: true });
    doc.fontSize(12).text(`Total Sales: ${breedingSales.length + meatSales.length}`);
    doc.text(`Total Revenue: UGX ${parseInt(grandTotal).toLocaleString()}`, { bold: true, color: 'green' });

    // Footer
    this.addFooter(doc);

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve({ fileName, filePath }));
      stream.on('error', reject);
    });
  }
}

export default new ReportService();
