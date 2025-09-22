# Hotel Management System

A complete offline hotel management system built with HTML, CSS, and JavaScript. This system runs entirely in the browser without requiring any server or internet connectivity after the initial load.

## Features

### 🏨 Complete Hotel Management
- **Dashboard**: Real-time overview of occupancy, revenue, and alerts
- **Room Management**: Add, edit, delete rooms with status tracking
- **Reservation Management**: Create, update, cancel reservations with validation
- **Guest Management**: Maintain guest profiles and history
- **Staff Management**: Manage staff roles and shift scheduling
- **Reporting**: Generate and export occupancy/revenue reports

### 💾 Offline Functionality
- All data stored locally using localStorage
- Works completely offline after initial load
- Data backup and export capabilities
- No external dependencies or APIs required

## Quick Start

1. **Open the System**: Simply open `index.html` in any modern web browser
2. **Sample Data**: The system initializes with sample data on first load
3. **Start Managing**: Navigate through the different sections using the top navigation

## Core Modules

### 📊 Dashboard
- **Metrics Display**: Total rooms, occupancy rate, daily revenue, active reservations
- **Real-time Alerts**: Maintenance notifications, checkout reminders, staffing alerts
- **Recent Activity**: Latest check-ins and reservations
- **Visual Indicators**: Progress bars and color-coded status displays

### 🏠 Room Management
- **CRUD Operations**: Create, read, update, delete rooms
- **Room Types**: Single, Double, Suite, Deluxe
- **Status Tracking**: Available (green), Occupied (red), Maintenance (yellow)
- **Pricing**: Set and update room prices per night
- **Validation**: Prevents deletion of rooms with active reservations

### 📅 Reservation Management
- **Booking System**: Create new reservations with guest and room assignment
- **Date Validation**: Prevents overlapping bookings and invalid date ranges
- **Status Management**: Confirmed, Checked-in, Checked-out, Cancelled
- **Auto-calculations**: Automatic total amount calculation based on duration
- **Search & Filter**: Find reservations by guest name, room number, or status

### 👥 Guest Management
- **Profile Creation**: Store guest information including contact details
- **History Tracking**: Automatic tracking of guest stay history
- **Search Functionality**: Find guests by name, phone, or email
- **Stay Statistics**: Display total number of stays per guest
- **Data Validation**: Prevents duplicate email addresses

### 👨‍💼 Staff Management
- **Role Assignment**: Reception, Cleaning, Maintenance, Security, Manager
- **Shift Scheduling**: Morning, Afternoon, Night shifts
- **Contact Information**: Phone and email storage
- **Status Tracking**: Active/Inactive staff members
- **Staffing Alerts**: Notifications for understaffing situations

### 📈 Reports & Analytics
- **Occupancy Reports**: Daily occupancy rates and trends
- **Revenue Reports**: Daily and cumulative revenue tracking
- **Guest Activity**: New vs. returning guest statistics
- **Date Range Selection**: Custom reporting periods
- **Export Options**: CSV download functionality

## Technical Specifications

### Data Storage
All data is stored in localStorage using these keys:
- `hotel_rooms`: Room details (ID, number, type, status, price)
- `hotel_reservations`: Reservations (ID, guest ID, room ID, dates, status)
- `hotel_guests`: Guest profiles (ID, name, contact, history)
- `hotel_staff`: Staff information (ID, name, role, contact, shift)
- `hotel_reports`: Cached report data

### Browser Compatibility
- **Supported**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **Requirements**: JavaScript enabled, localStorage support
- **Responsive**: Works on desktop, tablet, and mobile devices

### File Structure
```
Hotel management/
├── index.html          # Main application file
├── styles.css          # Complete styling and responsive design
├── app.js             # Full application logic and functionality
└── README.md          # This documentation file
```

## Usage Guide

### Initial Setup
1. Open `index.html` in your web browser
2. The system will automatically initialize with sample data
3. You'll see the dashboard with sample rooms, guests, and reservations

### Managing Rooms
1. Navigate to "Rooms" section
2. Click "Add Room" to create new rooms
3. Click "Edit" on existing rooms to modify details
4. Use color-coded status indicators to track room availability

### Creating Reservations
1. Go to "Reservations" section
2. Click "New Reservation"
3. Select guest and available room
4. Set check-in and check-out dates
5. The system will calculate total amount automatically

### Guest Management
1. Visit "Guests" section
2. Add new guests with contact information
3. Search existing guests using the search bar
4. View guest stay history and statistics

### Staff Operations
1. Access "Staff" section
2. Add staff members with roles and shifts
3. Monitor staffing levels through dashboard alerts
4. Update staff information as needed

### Generating Reports
1. Open "Reports" section
2. Select date range and report type
3. Click "Generate Report" to view results
4. Export data as CSV for external use

## Data Management

### Backup & Export
- **Full Data Export**: Use "Export Data" button in header for complete backup
- **Report Export**: Export specific reports as CSV files
- **Data Format**: JSON for full backups, CSV for reports

### Data Validation
- **Room Numbers**: Must be unique across the system
- **Email Addresses**: Guest emails must be unique
- **Date Validation**: Check-out dates must be after check-in dates
- **Reservation Conflicts**: Prevents double-booking of rooms

### Error Handling
- **Graceful Failures**: System continues operating even with data errors
- **User Feedback**: Clear error messages and success notifications
- **Data Recovery**: Automatic fallbacks for missing or corrupted data

## Security Features

### Data Protection
- **Local Storage**: All data remains on the user's device
- **No External Calls**: No data transmitted to external servers
- **Privacy Compliant**: No cookies or tracking mechanisms

### Input Validation
- **Form Validation**: Required fields and format checking
- **Data Sanitization**: Safe handling of user input
- **Business Logic**: Prevents invalid operations (e.g., deleting occupied rooms)

## Customization

### Styling
- Modify `styles.css` for custom themes and branding
- Responsive design adapts to different screen sizes
- CSS custom properties for easy color scheme updates

### Functionality
- Extend `app.js` for additional features
- Modular class structure for easy maintenance
- Well-documented code for developer understanding

## Troubleshooting

### Common Issues
1. **Data Not Saving**: Check if localStorage is enabled in browser
2. **Sample Data Missing**: Refresh page to reinitialize sample data
3. **Export Not Working**: Ensure pop-up blockers are disabled

### Browser Issues
- **Safari**: May require enabling localStorage in preferences
- **Incognito Mode**: localStorage may not persist between sessions
- **Mobile Browsers**: Some features may require desktop view

## Future Enhancements

### Potential Features
- PDF export functionality (requires additional library)
- Advanced reporting with charts and graphs
- Multi-language support
- Print-friendly layouts
- Data import from external sources

### Performance Optimizations
- Pagination for large datasets
- Search indexing for faster queries
- Caching strategies for improved performance

## Support

### Getting Help
- Review this README for common questions
- Check browser console for error messages
- Ensure JavaScript is enabled in browser settings

### Contributing
This is a standalone system designed for local use
- Modify source files directly for customizations
- Test changes thoroughly before deployment
- Backup data before making significant changes

## License

This hotel management system is provided as-is for educational and business use. Feel free to modify and adapt according to your specific needs.

---

**Last Updated**: October 2024  
**Version**: 1.0.0  
**Compatibility**: Modern web browsers with JavaScript support