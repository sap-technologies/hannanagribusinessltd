import React, { useState } from 'react';
import BackButton from './BackButton';
import './HelpPage.css';

function HelpPage({ onClose }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const sections = {
    overview: {
      title: 'System Overview',
      icon: '📖',
      content: [
        {
          subtitle: 'Welcome to Hannan Agribusiness Management System',
          text: 'This comprehensive system helps you manage all aspects of your agricultural operations including livestock management, crop production, and business analytics.'
        },
        {
          subtitle: 'Key Features',
          list: [
            'Goat Breeding and Health Tracking',
            'Matooke and Coffee Project Management',
            'Financial Tracking (Sales, Expenses)',
            'Automated Reminders and Notifications',
            'Report Generation and Analytics',
            'User Management and Role-Based Access'
          ]
        }
      ]
    },
    breedingFarm: {
      title: 'Breeding Farm Management',
      icon: '🐐',
      content: [
        {
          subtitle: 'Goat Registration',
          text: 'Register new goats with detailed information including tag ID, name, breed, gender, date of birth, and photo. Each goat can be linked to parents for lineage tracking.',
          steps: [
            'Navigate to Breeding Farm → Goats',
            'Click "Add New Record"',
            'Fill in required information',
            'Upload goat photo (optional)',
            'Save the record'
          ]
        },
        {
          subtitle: 'Breeding Records',
          text: 'Track breeding activities including mating dates, expected delivery dates, and breeding outcomes.',
          steps: [
            'Go to Breeding Farm → Breeding',
            'Click "Add New Record"',
            'Select female goat',
            'Enter breeding date and details',
            'Add outcome when available'
          ]
        },
        {
          subtitle: 'Health Management',
          text: 'Record health checkups, treatments, and medical history for each goat.',
          tips: [
            'Regular health checkups ensure early detection of issues',
            'Keep detailed treatment records',
            'Set reminders for follow-up visits'
          ]
        },
        {
          subtitle: 'Vaccination Tracking',
          text: 'Schedule and track all vaccinations to maintain herd health.',
          tips: [
            'Set reminder notifications for vaccination schedules',
            'Keep batch and manufacturer details',
            'Monitor adverse reactions'
          ]
        },
        {
          subtitle: 'Feeding Management',
          text: 'Track daily feeding activities, feed types, quantities, and costs.',
          tips: [
            'Record feed consumption patterns',
            'Monitor feed costs',
            'Track special dietary requirements'
          ]
        },
        {
          subtitle: 'Kid Growth Tracking',
          text: 'Monitor the growth and development of young goats (kids) from birth.',
          steps: [
            'Go to Breeding Farm → Kid Growth',
            'Select the kid to track',
            'Record weight measurements',
            'Add health observations',
            'Track weaning progress'
          ]
        },
        {
          subtitle: 'Sales Management',
          text: 'Record both meat sales and breeding stock sales with detailed transaction information.',
          types: [
            'Meat Sales: Track goats sold for meat production',
            'Breeding Sales: Record sales of breeding stock'
          ]
        }
      ]
    },
    crops: {
      title: 'Crop Projects (Matooke & Coffee)',
      icon: '🌾',
      content: [
        {
          subtitle: 'Farm Management',
          text: 'Create and manage multiple farms for matooke and coffee plantations.',
          steps: [
            'Select Matooke or Coffee Project from dashboard',
            'Click "Add New Farm"',
            'Enter farm details (name, location, size)',
            'Track plantation dates and varieties'
          ]
        },
        {
          subtitle: 'Harvest Tracking',
          text: 'Record harvest activities including dates, quantities, quality grades, and market prices.',
          tips: [
            'Regular harvest recording helps predict yields',
            'Track quality grades for better pricing',
            'Monitor market prices for optimal selling'
          ]
        }
      ]
    },
    financial: {
      title: 'Financial Management',
      icon: '💰',
      content: [
        {
          subtitle: 'Expense Tracking',
          text: 'Record all business expenses across different categories.',
          categories: [
            'Feed and Nutrition',
            'Veterinary Services',
            'Labor Costs',
            'Infrastructure',
            'Transportation',
            'Utilities',
            'Other Operational Costs'
          ],
          steps: [
            'Navigate to desired project',
            'Go to Expenses section',
            'Click "Add New Record"',
            'Select category and enter details',
            'Attach receipts if available'
          ]
        },
        {
          subtitle: 'Sales Revenue',
          text: 'All sales are automatically recorded in the system when you create sales records in the respective modules.',
          tip: 'Use the Monthly Summary feature to see comprehensive financial reports.'
        },
        {
          subtitle: 'Monthly Summaries',
          text: 'Generate monthly financial reports that consolidate all income and expenses.',
          steps: [
            'Go to any project',
            'Select "Monthly Summary"',
            'Choose the month and year',
            'Review income, expenses, and net profit',
            'Export reports for accounting'
          ]
        }
      ]
    },
    reports: {
      title: 'Reports & Analytics',
      icon: '📊',
      content: [
        {
          subtitle: 'Generate Reports',
          text: 'Create detailed reports for any date range across all modules.',
          steps: [
            'Click the "📊 Reports" button in the header',
            'Select report type (Goats, Breeding, Health, etc.)',
            'Choose date range',
            'Click "Generate Report"',
            'Export to Excel or PDF'
          ]
        },
        {
          subtitle: 'Available Report Types',
          list: [
            'Goat Inventory Report',
            'Breeding Activity Report',
            'Health Records Report',
            'Vaccination Schedule Report',
            'Feeding Costs Report',
            'Sales Performance Report',
            'Expense Analysis Report',
            'Monthly Financial Report',
            'Crop Harvest Report'
          ]
        }
      ]
    },
    notifications: {
      title: 'Notifications & Reminders',
      icon: '🔔',
      content: [
        {
          subtitle: 'Notifications',
          text: 'Stay informed about all system activities. The notification bell shows the count of unread notifications.',
          features: [
            'Real-time updates for all record changes',
            'Shows who performed each action',
            'Filter by read/unread status',
            'Mark as read individually or in bulk',
            'Clear all notifications'
          ]
        },
        {
          subtitle: 'Reminders',
          text: 'Set and manage reminders for important tasks and schedules.',
          categories: [
            'Breeding Due Dates',
            'Vaccination Schedules',
            'Health Checkup Appointments',
            'Feed Restocking',
            'General Tasks'
          ],
          steps: [
            'Click "📌 Reminders" in the header',
            'View reminders by category (Overdue, Today, Upcoming)',
            'Complete reminders by checking the checkbox',
            'Add custom reminders with descriptions'
          ]
        }
      ]
    },
    search: {
      title: 'Search Functionality',
      icon: '🔍',
      content: [
        {
          subtitle: 'Global Search',
          text: 'Search across all modules simultaneously to find any record quickly.',
          steps: [
            'Click the "🔍 Search" button in the header',
            'Enter your search term',
            'Results appear grouped by category',
            'Click any result to view details'
          ]
        },
        {
          subtitle: 'Search Tips',
          tips: [
            'Search by goat tag ID, name, or breed',
            'Search by farm name or location',
            'Search by date ranges',
            'Use specific terms for better results',
            'Search works across all projects'
          ]
        }
      ]
    },
    imageUpload: {
      title: 'Photo Upload Guidelines',
      icon: '📸',
      content: [
        {
          subtitle: 'Image Compression',
          text: 'The system automatically compresses images to optimize storage and loading speed while maintaining good quality.',
          features: [
            'Maximum file size: 5MB',
            'Supported formats: JPG, JPEG, PNG, WebP',
            'Automatic compression to ~100KB',
            'Quality maintained at 80%',
            'Progress indicator during upload'
          ]
        },
        {
          subtitle: 'Best Practices',
          tips: [
            'Take clear, well-lit photos',
            'Avoid blurry images',
            'Center the subject (goat, farm, etc.)',
            'Use landscape orientation for farms',
            'Portrait works best for individual goats',
            'Photos can be updated anytime'
          ]
        }
      ]
    },
    admin: {
      title: 'Admin Panel (Admins Only)',
      icon: '🔐',
      content: [
        {
          subtitle: 'User Management',
          text: 'Admins can manage all system users, assign roles, and control access.',
          features: [
            'View all registered users',
            'Create new user accounts',
            'Assign roles (Admin, Manager, Staff)',
            'Reset user passwords',
            'View user activity logs'
          ]
        },
        {
          subtitle: 'User Roles',
          roles: [
            {
              name: 'Admin',
              permissions: 'Full system access including user management, all records, and system settings'
            },
            {
              name: 'Manager',
              permissions: 'Can view and edit all records, generate reports, but cannot manage users'
            },
            {
              name: 'Staff',
              permissions: 'Can add and edit records in assigned modules, limited reporting access'
            }
          ]
        },
        {
          subtitle: 'System Statistics',
          text: 'The admin dashboard provides overview statistics of system usage and key metrics.'
        }
      ]
    },
    tips: {
      title: 'Tips & Best Practices',
      icon: '💡',
      content: [
        {
          subtitle: 'Data Entry',
          tips: [
            'Enter data consistently to maintain accuracy',
            'Use the remarks field to add important notes',
            'Most fields auto-save after you move to the next field',
            'Double-check dates before saving',
            'Upload photos to make records easier to identify'
          ]
        },
        {
          subtitle: 'Navigation',
          tips: [
            'Your current page is saved when you refresh',
            'Use the back arrow to return to previous view',
            'Click the logo to return to dashboard',
            'Use global search to quickly find records'
          ]
        },
        {
          subtitle: 'Performance',
          tips: [
            'The system works best on Chrome, Firefox, or Edge',
            'Clear browser cache if experiencing slow loading',
            'Close unused browser tabs',
            'Keep your internet connection stable for uploads'
          ]
        },
        {
          subtitle: 'Security',
          tips: [
            'Always logout when finished',
            'Do not share your login credentials',
            'Use a strong, unique password',
            'Change your password regularly',
            'Report suspicious activity to admins'
          ]
        }
      ]
    },
    troubleshooting: {
      title: 'Troubleshooting',
      icon: '🔧',
      content: [
        {
          subtitle: 'Common Issues',
          issues: [
            {
              problem: 'Cannot login',
              solutions: [
                'Verify your email and password are correct',
                'Check if Caps Lock is on',
                'Clear browser cookies and try again',
                'Contact admin to reset your password'
              ]
            },
            {
              problem: 'Images not uploading',
              solutions: [
                'Check file size is under 5MB',
                'Verify file format is JPG, PNG, or WebP',
                'Check your internet connection',
                'Try a different browser',
                'Clear browser cache'
              ]
            },
            {
              problem: 'Data not saving',
              solutions: [
                'Ensure all required fields are filled',
                'Check your internet connection',
                'Refresh the page and try again',
                'Check if you have permission to edit'
              ]
            },
            {
              problem: 'Reports not generating',
              solutions: [
                'Verify date range is correct',
                'Ensure data exists for selected period',
                'Try selecting a shorter date range',
                'Check browser console for errors'
              ]
            },
            {
              problem: 'Page not loading',
              solutions: [
                'Refresh the browser (F5 or Ctrl+R)',
                'Clear browser cache and cookies',
                'Try a different browser',
                'Check internet connection',
                'Contact system administrator'
              ]
            }
          ]
        }
      ]
    },
    contact: {
      title: 'Support & Contact',
      icon: '📞',
      content: [
        {
          subtitle: 'Getting Help',
          text: 'If you need assistance or have questions not covered in this documentation:'
        },
        {
          subtitle: 'Contact Information',
          contacts: [
            {
              type: 'System Administrator',
              action: 'Contact your system admin for password resets and access issues'
            },
            {
              type: 'Technical Support',
              action: 'Report bugs or technical issues to the IT department'
            },
            {
              type: 'Training',
              action: 'Request additional training sessions from your manager'
            }
          ]
        },
        {
          subtitle: 'Feedback',
          text: 'Your feedback helps improve the system. Share suggestions for new features or improvements with your administrator.'
        }
      ]
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  const filteredSections = Object.entries(sections).filter(([key, section]) => {
    if (!searchTerm) return true;
    
    const searchIn = JSON.stringify(section).toLowerCase();
    return searchIn.includes(searchTerm);
  });

  const renderContent = (content) => {
    return content.map((item, index) => (
      <div key={index} className="help-content-block">
        {item.subtitle && <h3>{item.subtitle}</h3>}
        {item.text && <p>{item.text}</p>}
        
        {item.steps && (
          <div className="help-steps">
            <strong>Steps:</strong>
            <ol>
              {item.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        )}
        
        {item.tips && (
          <div className="help-tips">
            <strong>💡 Tips:</strong>
            <ul>
              {item.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
        
        {item.list && (
          <ul className="help-list">
            {item.list.map((listItem, i) => (
              <li key={i}>{listItem}</li>
            ))}
          </ul>
        )}
        
        {item.categories && (
          <div className="help-categories">
            <strong>Categories:</strong>
            <ul>
              {item.categories.map((cat, i) => (
                <li key={i}>{cat}</li>
              ))}
            </ul>
          </div>
        )}
        
        {item.features && (
          <ul className="help-features">
            {item.features.map((feature, i) => (
              <li key={i}>✓ {feature}</li>
            ))}
          </ul>
        )}
        
        {item.types && (
          <ul className="help-types">
            {item.types.map((type, i) => (
              <li key={i}><strong>{type.split(':')[0]}:</strong>{type.split(':')[1]}</li>
            ))}
          </ul>
        )}
        
        {item.roles && (
          <div className="help-roles">
            {item.roles.map((role, i) => (
              <div key={i} className="role-card">
                <strong>{role.name}</strong>
                <p>{role.permissions}</p>
              </div>
            ))}
          </div>
        )}
        
        {item.contacts && (
          <div className="help-contacts">
            {item.contacts.map((contact, i) => (
              <div key={i} className="contact-card">
                <strong>{contact.type}:</strong>
                <p>{contact.action}</p>
              </div>
            ))}
          </div>
        )}
        
        {item.issues && (
          <div className="help-issues">
            {item.issues.map((issue, i) => (
              <div key={i} className="issue-card">
                <strong>🔴 {issue.problem}</strong>
                <div className="solutions">
                  <em>Solutions:</em>
                  <ul>
                    {issue.solutions.map((solution, j) => (
                      <li key={j}>{solution}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {item.tip && (
          <div className="help-tip-box">
            <strong>💡 Tip:</strong> {item.tip}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="help-page">
      {onClose && <BackButton onClick={onClose} label="Back" />}
      <div className="help-header">
        <div className="help-header-content">
          <h1>📚 Help & Documentation</h1>
          <p>Comprehensive guide to using Hannan Agribusiness Management System</p>
        </div>
        <div className="help-search">
          <input
            type="text"
            placeholder="Search documentation..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="help-search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="help-container">
        <aside className="help-sidebar">
          <h3>Topics</h3>
          <nav className="help-nav">
            {Object.entries(sections).map(([key, section]) => (
              <button
                key={key}
                className={`help-nav-item ${activeSection === key ? 'active' : ''}`}
                onClick={() => setActiveSection(key)}
              >
                <span className="nav-icon">{section.icon}</span>
                <span className="nav-label">{section.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="help-main">
          {!searchTerm ? (
            <div className="help-section">
              <div className="section-header">
                <h2>
                  <span className="section-icon">{sections[activeSection].icon}</span>
                  {sections[activeSection].title}
                </h2>
              </div>
              <div className="section-content">
                {renderContent(sections[activeSection].content)}
              </div>
            </div>
          ) : (
            <div className="help-search-results">
              <h2>Search Results for "{searchTerm}"</h2>
              {filteredSections.length > 0 ? (
                filteredSections.map(([key, section]) => (
                  <div key={key} className="search-result-section">
                    <h3>
                      <span className="section-icon">{section.icon}</span>
                      {section.title}
                    </h3>
                    <div className="section-content">
                      {renderContent(section.content)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>No results found for "{searchTerm}"</p>
                  <p>Try different keywords or browse through the topics on the left.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default HelpPage;
