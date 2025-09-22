// Hotel Management System - Main Application
class HotelManagementSystem {
    constructor() {
        this.data = {rooms: [], reservations: [], guests: [], staff: [], reports: []};
        this.currentSection = 'dashboard';
        this.editingItem = null;
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateCurrentDate();
        this.renderDashboard();
        if (this.data.rooms.length === 0) this.initializeSampleData();
    }
    
    // Data Management
    loadData() {
        try {
            this.data.rooms = JSON.parse(localStorage.getItem('hotel_rooms') || '[]');
            this.data.reservations = JSON.parse(localStorage.getItem('hotel_reservations') || '[]');
            this.data.guests = JSON.parse(localStorage.getItem('hotel_guests') || '[]');
            this.data.staff = JSON.parse(localStorage.getItem('hotel_staff') || '[]');
            this.data.reports = JSON.parse(localStorage.getItem('hotel_reports') || '[]');
        } catch (error) {
            console.error('Error loading data:', error);
            this.showAlert('Error loading data', 'danger');
        }
    }
    
    saveData() {
        try {
            localStorage.setItem('hotel_rooms', JSON.stringify(this.data.rooms));
            localStorage.setItem('hotel_reservations', JSON.stringify(this.data.reservations));
            localStorage.setItem('hotel_guests', JSON.stringify(this.data.guests));
            localStorage.setItem('hotel_staff', JSON.stringify(this.data.staff));
            localStorage.setItem('hotel_reports', JSON.stringify(this.data.reports));
        } catch (error) {
            console.error('Error saving data:', error);
            this.showAlert('Error saving data', 'danger');
        }
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    initializeSampleData() {
        const sampleRooms = [
            { id: this.generateId(), number: '101', type: 'single', price: 80, status: 'available' },
            { id: this.generateId(), number: '102', type: 'double', price: 120, status: 'occupied' },
            { id: this.generateId(), number: '103', type: 'suite', price: 200, status: 'available' },
            { id: this.generateId(), number: '201', type: 'double', price: 120, status: 'maintenance' },
            { id: this.generateId(), number: '202', type: 'single', price: 80, status: 'available' }
        ];
        
        const sampleGuests = [
            { id: this.generateId(), name: 'John Smith', phone: '+1234567890', email: 'john.smith@email.com', address: '123 Main St, City, State', history: [] },
            { id: this.generateId(), name: 'Sarah Johnson', phone: '+1987654321', email: 'sarah.johnson@email.com', address: '456 Oak Ave, City, State', history: [] }
        ];
        
        const sampleStaff = [
            { id: this.generateId(), name: 'Alice Manager', role: 'manager', phone: '+1111111111', email: 'alice@hotel.com', shift: 'morning', status: 'active' },
            { id: this.generateId(), name: 'Bob Reception', role: 'reception', phone: '+2222222222', email: 'bob@hotel.com', shift: 'afternoon', status: 'active' }
        ];
        
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const sampleReservations = [{
            id: this.generateId(),
            guestId: sampleGuests[0].id,
            roomId: sampleRooms[1].id,
            checkIn: today.toISOString().split('T')[0],
            checkOut: nextWeek.toISOString().split('T')[0],
            status: 'checked-in',
            totalAmount: 840
        }];
        
        this.data.rooms = sampleRooms;
        this.data.guests = sampleGuests;
        this.data.staff = sampleStaff;
        this.data.reservations = sampleReservations;
        this.saveData();
        this.showAlert('Sample data initialized successfully', 'success');
    }
    
    // Event Listeners
    setupEventListeners() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.switchSection(section);
            });
        });
        
        this.setupModalControls();
        this.setupFormHandlers();
        this.setupSearchAndFilters();
        
        document.getElementById('exportDataBtn').addEventListener('click', () => this.exportAllData());
        document.getElementById('generateReportBtn').addEventListener('click', () => this.generateReport());
        document.getElementById('exportCSVBtn').addEventListener('click', () => this.exportReportCSV());
        document.getElementById('exportPDFBtn').addEventListener('click', () => this.exportReportPDF());
    }
    
    setupModalControls() {
        const modals = ['room', 'reservation', 'guest', 'staff'];
        modals.forEach(type => {
            document.getElementById(`add${type.charAt(0).toUpperCase() + type.slice(1)}Btn`).addEventListener('click', () => {
                this[`open${type.charAt(0).toUpperCase() + type.slice(1)}Modal`]();
            });
            
            document.getElementById(`close${type.charAt(0).toUpperCase() + type.slice(1)}Modal`).addEventListener('click', () => {
                this.closeModal(`${type}Modal`);
            });
            
            document.getElementById(`cancel${type.charAt(0).toUpperCase() + type.slice(1)}Btn`).addEventListener('click', () => {
                this.closeModal(`${type}Modal`);
            });
        });
        
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal(modal.id);
            });
        });
    }
    
    setupFormHandlers() {
        ['room', 'reservation', 'guest', 'staff'].forEach(type => {
            document.getElementById(`${type}Form`).addEventListener('submit', (e) => {
                e.preventDefault();
                this[`handle${type.charAt(0).toUpperCase() + type.slice(1)}Submit`]();
            });
        });
    }
    
    setupSearchAndFilters() {
        document.getElementById('reservationSearch').addEventListener('input', () => this.filterReservations());
        document.getElementById('reservationStatusFilter').addEventListener('change', () => this.filterReservations());
        document.getElementById('guestSearch').addEventListener('input', () => this.filterGuests());
    }
    
    // Utility Functions
    updateCurrentDate() {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
        });
        document.getElementById('currentDate').textContent = dateStr;
        document.getElementById('dashboardDate').textContent = dateStr;
    }
    
    switchSection(section) {
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
        
        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(section).classList.add('active');
        
        this.currentSection = section;
        
        const renderMethods = {
            dashboard: 'renderDashboard',
            rooms: 'renderRooms',
            reservations: 'renderReservations',
            guests: 'renderGuests',
            staff: 'renderStaff',
            reports: 'renderReports'
        };
        
        if (renderMethods[section]) {
            this[renderMethods[section]]();
        }
    }
    
    showAlert(message, type = 'info') {
        const alertsContainer = document.getElementById('alertsContainer');
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        
        const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', danger: '❌' };
        
        alert.innerHTML = `
            <span class="alert-icon">${icons[type]}</span>
            <span>${message}</span>
        `;
        
        alertsContainer.appendChild(alert);
        setTimeout(() => {
            if (alert.parentNode) alert.parentNode.removeChild(alert);
        }, 5000);
    }
    
    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        this.editingItem = null;
    }
    
    // Dashboard Functions
    renderDashboard() {
        const totalRooms = this.data.rooms.length;
        const occupiedRooms = this.data.rooms.filter(room => room.status === 'occupied').length;
        const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;
        
        const today = new Date().toISOString().split('T')[0];
        const activeReservations = this.data.reservations.filter(res => 
            res.status === 'checked-in' || 
            (res.status === 'confirmed' && res.checkIn <= today && res.checkOut >= today)
        );
        
        const dailyRevenue = activeReservations.reduce((total, res) => {
            const room = this.data.rooms.find(r => r.id === res.roomId);
            return total + (room ? room.price : 0);
        }, 0);
        
        document.getElementById('totalRooms').textContent = totalRooms;
        document.getElementById('occupiedRooms').textContent = occupiedRooms;
        document.getElementById('occupancyPercentage').textContent = `${occupancyRate.toFixed(1)}%`;
        document.getElementById('occupancyProgress').style.width = `${occupancyRate}%`;
        document.getElementById('dailyRevenue').textContent = `$${dailyRevenue.toFixed(2)}`;
        document.getElementById('activeReservations').textContent = activeReservations.length;
        
        this.renderRecentActivity();
        this.generateAlerts();
    }
    
    renderRecentActivity() {
        const activityContainer = document.getElementById('recentActivity');
        const recentReservations = this.data.reservations
            .sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn))
            .slice(0, 5);
        
        if (recentReservations.length === 0) {
            activityContainer.innerHTML = '<p style="color: #64748b;">No recent activity</p>';
            return;
        }
        
        const activityHTML = recentReservations.map(reservation => {
            const guest = this.data.guests.find(g => g.id === reservation.guestId);
            const room = this.data.rooms.find(r => r.id === reservation.roomId);
            
            return `
                <div class="activity-item">
                    <strong>${guest ? guest.name : 'Unknown Guest'}</strong>
                    ${reservation.status === 'checked-in' ? 'checked into' : 'reserved'} 
                    Room ${room ? room.number : 'Unknown'}
                    <span style="color: #64748b;">(${new Date(reservation.checkIn).toLocaleDateString()})</span>
                </div>
            `;
        }).join('');
        
        activityContainer.innerHTML = activityHTML;
    }
    
    generateAlerts() {
        const alertsContainer = document.getElementById('alertsContainer');
        const alerts = [];
        
        const maintenanceRooms = this.data.rooms.filter(room => room.status === 'maintenance');
        maintenanceRooms.forEach(room => {
            alerts.push({ type: 'warning', message: `Room ${room.number} is under maintenance` });
        });
        
        const today = new Date().toISOString().split('T')[0];
        const todayCheckouts = this.data.reservations.filter(res => 
            res.status === 'checked-in' && res.checkOut === today
        );
        
        todayCheckouts.forEach(reservation => {
            const guest = this.data.guests.find(g => g.id === reservation.guestId);
            const room = this.data.rooms.find(r => r.id === reservation.roomId);
            alerts.push({
                type: 'info',
                message: `${guest ? guest.name : 'Guest'} checkout due today from Room ${room ? room.number : 'Unknown'}`
            });
        });
        
        const activeStaff = this.data.staff.filter(staff => staff.status === 'active');
        if (activeStaff.length < 3) {
            alerts.push({ type: 'warning', message: 'Low staff count - consider scheduling more staff' });
        }
        
        if (alerts.length === 0) {
            alertsContainer.innerHTML = `
                <div class="alert alert-success">
                    <span class="alert-icon">✅</span>
                    <span>All systems operating normally</span>
                </div>
            `;
        } else {
            alertsContainer.innerHTML = alerts.map(alert => `
                <div class="alert alert-${alert.type}">
                    <span class="alert-icon">${alert.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                    <span>${alert.message}</span>
                </div>
            `).join('');
        }
    }
    
    // Room Management
    renderRooms() {
        const roomsGrid = document.getElementById('roomsGrid');
        
        if (this.data.rooms.length === 0) {
            roomsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                    <p style="color: #64748b; margin-bottom: 1rem;">No rooms available</p>
                    <button class="btn btn-primary" onclick="hotelSystem.openRoomModal()">Add First Room</button>
                </div>
            `;
            return;
        }
        
        const roomsHTML = this.data.rooms.map(room => `
            <div class="room-card" data-room-id="${room.id}">
                <div class="room-header">
                    <div class="room-number">Room ${room.number}</div>
                    <div class="room-status status-${room.status}">${room.status}</div>
                </div>
                <div class="room-details">
                    <div class="room-type">${room.type} room</div>
                    <div class="room-price">$${room.price}/night</div>
                </div>
                <div class="room-actions">
                    <button class="btn btn-small btn-primary" onclick="hotelSystem.editRoom('${room.id}')">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="hotelSystem.deleteRoom('${room.id}')">Delete</button>
                </div>
            </div>
        `).join('');
        
        roomsGrid.innerHTML = roomsHTML;
    }
    
    openRoomModal(roomId = null) {
        this.editingItem = roomId;
        const modal = document.getElementById('roomModal');
        const title = document.getElementById('roomModalTitle');
        const form = document.getElementById('roomForm');
        
        if (roomId) {
            const room = this.data.rooms.find(r => r.id === roomId);
            title.textContent = 'Edit Room';
            document.getElementById('roomNumber').value = room.number;
            document.getElementById('roomType').value = room.type;
            document.getElementById('roomPrice').value = room.price;
            document.getElementById('roomStatus').value = room.status;
        } else {
            title.textContent = 'Add Room';
            form.reset();
        }
        
        modal.classList.add('active');
    }
    
    handleRoomSubmit() {
        const formData = {
            number: document.getElementById('roomNumber').value,
            type: document.getElementById('roomType').value,
            price: parseFloat(document.getElementById('roomPrice').value),
            status: document.getElementById('roomStatus').value
        };
        
        if (this.data.rooms.some(room => 
            room.number === formData.number && 
            (!this.editingItem || room.id !== this.editingItem)
        )) {
            this.showAlert('Room number already exists', 'danger');
            return;
        }
        
        if (this.editingItem) {
            const roomIndex = this.data.rooms.findIndex(r => r.id === this.editingItem);
            this.data.rooms[roomIndex] = { ...this.data.rooms[roomIndex], ...formData };
            this.showAlert('Room updated successfully', 'success');
        } else {
            const newRoom = { id: this.generateId(), ...formData };
            this.data.rooms.push(newRoom);
            this.showAlert('Room added successfully', 'success');
        }
        
        this.saveData();
        this.closeModal('roomModal');
        this.renderRooms();
        if (this.currentSection === 'dashboard') this.renderDashboard();
    }
    
    editRoom(roomId) {
        this.openRoomModal(roomId);
    }
    
    deleteRoom(roomId) {
        const hasActiveReservation = this.data.reservations.some(res => 
            res.roomId === roomId && (res.status === 'confirmed' || res.status === 'checked-in')
        );
        
        if (hasActiveReservation) {
            this.showAlert('Cannot delete room with active reservations', 'danger');
            return;
        }
        
        if (confirm('Are you sure you want to delete this room?')) {
            this.data.rooms = this.data.rooms.filter(room => room.id !== roomId);
            this.saveData();
            this.renderRooms();
            this.showAlert('Room deleted successfully', 'success');
            if (this.currentSection === 'dashboard') this.renderDashboard();
        }
    }
    
    // Reservation Management
    renderReservations() {
        this.updateReservationDropdowns();
        this.filterReservations();
    }
    
    updateReservationDropdowns() {
        const guestSelect = document.getElementById('reservationGuest');
        const roomSelect = document.getElementById('reservationRoom');
        
        guestSelect.innerHTML = '<option value="">Select Guest</option>' +
            this.data.guests.map(guest => `<option value="${guest.id}">${guest.name}</option>`).join('');
        
        roomSelect.innerHTML = '<option value="">Select Room</option>' +
            this.data.rooms.filter(room => room.status === 'available').map(room => 
                `<option value="${room.id}">Room ${room.number} (${room.type} - $${room.price}/night)</option>`
            ).join('');
    }
    
    filterReservations() {
        const searchTerm = document.getElementById('reservationSearch').value.toLowerCase();
        const statusFilter = document.getElementById('reservationStatusFilter').value;
        
        let filteredReservations = this.data.reservations;
        
        if (searchTerm) {
            filteredReservations = filteredReservations.filter(reservation => {
                const guest = this.data.guests.find(g => g.id === reservation.guestId);
                const room = this.data.rooms.find(r => r.id === reservation.roomId);
                return (guest && guest.name.toLowerCase().includes(searchTerm)) ||
                       (room && room.number.toLowerCase().includes(searchTerm)) ||
                       reservation.id.toLowerCase().includes(searchTerm);
            });
        }
        
        if (statusFilter) {
            filteredReservations = filteredReservations.filter(reservation => 
                reservation.status === statusFilter
            );
        }
        
        this.renderReservationsTable(filteredReservations);
    }
    
    renderReservationsTable(reservations) {
        const tbody = document.getElementById('reservationsTableBody');
        
        if (reservations.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 1rem;">No reservations found</td></tr>';
            return;
        }
        
        const reservationsHTML = reservations.map(reservation => {
            const guest = this.data.guests.find(g => g.id === reservation.guestId);
            const room = this.data.rooms.find(r => r.id === reservation.roomId);
            
            return `
                <tr>
                    <td>${reservation.id.substr(0, 8)}...</td>
                    <td>${guest ? guest.name : 'Unknown Guest'}</td>
                    <td>Room ${room ? room.number : 'Unknown'}</td>
                    <td>${new Date(reservation.checkIn).toLocaleDateString()}</td>
                    <td>${new Date(reservation.checkOut).toLocaleDateString()}</td>
                    <td><span class="status-badge status-${reservation.status}">${reservation.status}</span></td>
                    <td>
                        <button class="btn btn-small btn-primary" onclick="hotelSystem.editReservation('${reservation.id}')">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="hotelSystem.deleteReservation('${reservation.id}')">Cancel</button>
                    </td>
                </tr>
            `;
        }).join('');
        
        tbody.innerHTML = reservationsHTML;
    }
    
    openReservationModal(reservationId = null) {
        this.editingItem = reservationId;
        const modal = document.getElementById('reservationModal');
        const title = document.getElementById('reservationModalTitle');
        const form = document.getElementById('reservationForm');
        
        this.updateReservationDropdowns();
        
        if (reservationId) {
            const reservation = this.data.reservations.find(r => r.id === reservationId);
            title.textContent = 'Edit Reservation';
            document.getElementById('reservationGuest').value = reservation.guestId;
            document.getElementById('reservationRoom').value = reservation.roomId;
            document.getElementById('checkInDate').value = reservation.checkIn;
            document.getElementById('checkOutDate').value = reservation.checkOut;
            document.getElementById('reservationStatus').value = reservation.status;
            
            const currentRoom = this.data.rooms.find(r => r.id === reservation.roomId);
            if (currentRoom && currentRoom.status !== 'available') {
                const roomSelect = document.getElementById('reservationRoom');
                const option = document.createElement('option');
                option.value = currentRoom.id;
                option.textContent = `Room ${currentRoom.number} (${currentRoom.type} - $${currentRoom.price}/night) - Current`;
                roomSelect.appendChild(option);
                roomSelect.value = reservation.roomId;
            }
        } else {
            title.textContent = 'New Reservation';
            form.reset();
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            document.getElementById('checkInDate').value = today.toISOString().split('T')[0];
            document.getElementById('checkOutDate').value = tomorrow.toISOString().split('T')[0];
        }
        
        modal.classList.add('active');
    }
    
    handleReservationSubmit() {
        const formData = {
            guestId: document.getElementById('reservationGuest').value,
            roomId: document.getElementById('reservationRoom').value,
            checkIn: document.getElementById('checkInDate').value,
            checkOut: document.getElementById('checkOutDate').value,
            status: document.getElementById('reservationStatus').value
        };
        
        if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
            this.showAlert('Check-out date must be after check-in date', 'danger');
            return;
        }
        
        const overlapping = this.data.reservations.some(res => 
            res.roomId === formData.roomId &&
            res.id !== this.editingItem &&
            res.status !== 'cancelled' &&
            res.status !== 'checked-out' &&
            ((formData.checkIn >= res.checkIn && formData.checkIn < res.checkOut) ||
             (formData.checkOut > res.checkIn && formData.checkOut <= res.checkOut) ||
             (formData.checkIn <= res.checkIn && formData.checkOut >= res.checkOut))
        );
        
        if (overlapping) {
            this.showAlert('Room is not available for selected dates', 'danger');
            return;
        }
        
        if (this.editingItem) {
            const reservationIndex = this.data.reservations.findIndex(r => r.id === this.editingItem);
            const oldReservation = this.data.reservations[reservationIndex];
            this.data.reservations[reservationIndex] = { ...oldReservation, ...formData };
            this.updateRoomStatusFromReservation(formData, oldReservation);
            this.showAlert('Reservation updated successfully', 'success');
        } else {
            const room = this.data.rooms.find(r => r.id === formData.roomId);
            const nights = Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24));
            const totalAmount = nights * room.price;
            
            const newReservation = { id: this.generateId(), ...formData, totalAmount };
            this.data.reservations.push(newReservation);
            
            if (formData.status === 'checked-in' || 
                (formData.status === 'confirmed' && formData.checkIn <= new Date().toISOString().split('T')[0])) {
                room.status = 'occupied';
            }
            
            this.showAlert('Reservation created successfully', 'success');
        }
        
        this.saveData();
        this.closeModal('reservationModal');
        this.renderReservations();
        if (this.currentSection === 'dashboard') this.renderDashboard();
    }
    
    updateRoomStatusFromReservation(newReservation, oldReservation = null) {
        const room = this.data.rooms.find(r => r.id === newReservation.roomId);
        if (!room) return;
        
        if (newReservation.status === 'checked-in' || 
            (newReservation.status === 'confirmed' && newReservation.checkIn <= new Date().toISOString().split('T')[0])) {
            room.status = 'occupied';
        } else if (newReservation.status === 'checked-out' || newReservation.status === 'cancelled') {
            const hasOtherActiveReservations = this.data.reservations.some(res => 
                res.roomId === room.id && 
                res.id !== newReservation.id && 
                (res.status === 'checked-in' || res.status === 'confirmed')
            );
            if (!hasOtherActiveReservations) {
                room.status = 'available';
            }
        }
    }
    
    editReservation(reservationId) {
        this.openReservationModal(reservationId);
    }
    
    deleteReservation(reservationId) {
        if (confirm('Are you sure you want to cancel this reservation?')) {
            const reservation = this.data.reservations.find(r => r.id === reservationId);
            if (reservation) {
                reservation.status = 'cancelled';
                this.updateRoomStatusFromReservation(reservation);
                this.saveData();
                this.renderReservations();
                this.showAlert('Reservation cancelled successfully', 'success');
                if (this.currentSection === 'dashboard') this.renderDashboard();
            }
        }
    }
    
    // Guest Management
    renderGuests() {
        this.filterGuests();
    }
    
    filterGuests() {
        const searchTerm = document.getElementById('guestSearch').value.toLowerCase();
        let filteredGuests = this.data.guests;
        
        if (searchTerm) {
            filteredGuests = filteredGuests.filter(guest => 
                guest.name.toLowerCase().includes(searchTerm) ||
                guest.phone.includes(searchTerm) ||
                guest.email.toLowerCase().includes(searchTerm)
            );
        }
        
        this.renderGuestsTable(filteredGuests);
    }
    
    renderGuestsTable(guests) {
        const tbody = document.getElementById('guestsTableBody');
        
        if (guests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 1rem;">No guests found</td></tr>';
            return;
        }
        
        const guestsHTML = guests.map(guest => {
            const totalStays = this.data.reservations.filter(res => res.guestId === guest.id).length;
            
            return `
                <tr>
                    <td>${guest.id.substr(0, 8)}...</td>
                    <td>${guest.name}</td>
                    <td>${guest.phone}</td>
                    <td>${guest.email}</td>
                    <td>${totalStays}</td>
                    <td>
                        <button class="btn btn-small btn-primary" onclick="hotelSystem.editGuest('${guest.id}')">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="hotelSystem.deleteGuest('${guest.id}')">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
        
        tbody.innerHTML = guestsHTML;
    }
    
    openGuestModal(guestId = null) {
        this.editingItem = guestId;
        const modal = document.getElementById('guestModal');
        const title = document.getElementById('guestModalTitle');
        const form = document.getElementById('guestForm');
        
        if (guestId) {
            const guest = this.data.guests.find(g => g.id === guestId);
            title.textContent = 'Edit Guest';
            document.getElementById('guestName').value = guest.name;
            document.getElementById('guestPhone').value = guest.phone;
            document.getElementById('guestEmail').value = guest.email;
            document.getElementById('guestAddress').value = guest.address || '';
        } else {
            title.textContent = 'Add Guest';
            form.reset();
        }
        
        modal.classList.add('active');
    }
    
    handleGuestSubmit() {
        const formData = {
            name: document.getElementById('guestName').value,
            phone: document.getElementById('guestPhone').value,
            email: document.getElementById('guestEmail').value,
            address: document.getElementById('guestAddress').value
        };
        
        if (this.data.guests.some(guest => 
            guest.email === formData.email && 
            (!this.editingItem || guest.id !== this.editingItem)
        )) {
            this.showAlert('Email already exists', 'danger');
            return;
        }
        
        if (this.editingItem) {
            const guestIndex = this.data.guests.findIndex(g => g.id === this.editingItem);
            this.data.guests[guestIndex] = { ...this.data.guests[guestIndex], ...formData };
            this.showAlert('Guest updated successfully', 'success');
        } else {
            const newGuest = { id: this.generateId(), ...formData, history: [] };
            this.data.guests.push(newGuest);
            this.showAlert('Guest added successfully', 'success');
        }
        
        this.saveData();
        this.closeModal('guestModal');
        this.renderGuests();
    }
    
    editGuest(guestId) {
        this.openGuestModal(guestId);
    }
    
    deleteGuest(guestId) {
        const hasReservations = this.data.reservations.some(res => res.guestId === guestId);
        
        if (hasReservations) {
            this.showAlert('Cannot delete guest with existing reservations', 'danger');
            return;
        }
        
        if (confirm('Are you sure you want to delete this guest?')) {
            this.data.guests = this.data.guests.filter(guest => guest.id !== guestId);
            this.saveData();
            this.renderGuests();
            this.showAlert('Guest deleted successfully', 'success');
        }
    }
    
    // Staff Management
    renderStaff() {
        const tbody = document.getElementById('staffTableBody');
        
        if (this.data.staff.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 1rem;">No staff members found</td></tr>';
            return;
        }
        
        const staffHTML = this.data.staff.map(staff => `
            <tr>
                <td>${staff.id.substr(0, 8)}...</td>
                <td>${staff.name}</td>
                <td style="text-transform: capitalize;">${staff.role}</td>
                <td>${staff.phone}</td>
                <td style="text-transform: capitalize;">${staff.shift}</td>
                <td><span class="status-badge status-${staff.status}">${staff.status}</span></td>
                <td>
                    <button class="btn btn-small btn-primary" onclick="hotelSystem.editStaff('${staff.id}')">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="hotelSystem.deleteStaff('${staff.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
        
        tbody.innerHTML = staffHTML;
    }
    
    openStaffModal(staffId = null) {
        this.editingItem = staffId;
        const modal = document.getElementById('staffModal');
        const title = document.getElementById('staffModalTitle');
        const form = document.getElementById('staffForm');
        
        if (staffId) {
            const staff = this.data.staff.find(s => s.id === staffId);
            title.textContent = 'Edit Staff';
            document.getElementById('staffName').value = staff.name;
            document.getElementById('staffRole').value = staff.role;
            document.getElementById('staffPhone').value = staff.phone;
            document.getElementById('staffEmail').value = staff.email || '';
            document.getElementById('staffShift').value = staff.shift;
        } else {
            title.textContent = 'Add Staff';
            form.reset();
        }
        
        modal.classList.add('active');
    }
    
    handleStaffSubmit() {
        const formData = {
            name: document.getElementById('staffName').value,
            role: document.getElementById('staffRole').value,
            phone: document.getElementById('staffPhone').value,
            email: document.getElementById('staffEmail').value,
            shift: document.getElementById('staffShift').value,
            status: 'active'
        };
        
        if (this.editingItem) {
            const staffIndex = this.data.staff.findIndex(s => s.id === this.editingItem);
            this.data.staff[staffIndex] = { ...this.data.staff[staffIndex], ...formData };
            this.showAlert('Staff updated successfully', 'success');
        } else {
            const newStaff = { id: this.generateId(), ...formData };
            this.data.staff.push(newStaff);
            this.showAlert('Staff added successfully', 'success');
        }
        
        this.saveData();
        this.closeModal('staffModal');
        this.renderStaff();
        if (this.currentSection === 'dashboard') this.renderDashboard();
    }
    
    editStaff(staffId) {
        this.openStaffModal(staffId);
    }
    
    deleteStaff(staffId) {
        if (confirm('Are you sure you want to delete this staff member?')) {
            this.data.staff = this.data.staff.filter(staff => staff.id !== staffId);
            this.saveData();
            this.renderStaff();
            this.showAlert('Staff deleted successfully', 'success');
            if (this.currentSection === 'dashboard') this.renderDashboard();
        }
    }
    
    // Reports Management
    renderReports() {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        
        document.getElementById('reportDateFrom').value = firstDay.toISOString().split('T')[0];
        document.getElementById('reportDateTo').value = today.toISOString().split('T')[0];
        
        document.getElementById('reportContent').innerHTML = '<p style="color: #64748b; text-align: center; padding: 2rem;">Select date range and report type, then click "Generate Report"</p>';
        document.getElementById('exportOptions').style.display = 'none';
    }
    
    generateReport() {
        const fromDate = document.getElementById('reportDateFrom').value;
        const toDate = document.getElementById('reportDateTo').value;
        const reportType = document.getElementById('reportType').value;
        
        if (!fromDate || !toDate) {
            this.showAlert('Please select date range', 'danger');
            return;
        }
        
        if (new Date(toDate) < new Date(fromDate)) {
            this.showAlert('End date must be after start date', 'danger');
            return;
        }
        
        let reportData;
        let reportHTML;
        
        switch (reportType) {
            case 'occupancy':
                reportData = this.generateOccupancyReport(fromDate, toDate);
                reportHTML = this.renderOccupancyReport(reportData);
                break;
            case 'revenue':
                reportData = this.generateRevenueReport(fromDate, toDate);
                reportHTML = this.renderRevenueReport(reportData);
                break;
            case 'guest-activity':
                reportData = this.generateGuestActivityReport(fromDate, toDate);
                reportHTML = this.renderGuestActivityReport(reportData);
                break;
            default:
                this.showAlert('Please select a report type', 'danger');
                return;
        }
        
        document.getElementById('reportContent').innerHTML = reportHTML;
        document.getElementById('exportOptions').style.display = 'flex';
        
        this.currentReportData = reportData;
        this.currentReportType = reportType;
    }
    
    generateOccupancyReport(fromDate, toDate) {
        const dateRange = this.getDateRange(fromDate, toDate);
        const data = [];
        
        dateRange.forEach(date => {
            const occupiedRooms = this.data.reservations.filter(res => 
                res.checkIn <= date && res.checkOut > date && 
                (res.status === 'checked-in' || res.status === 'confirmed')
            ).length;
            
            const totalRooms = this.data.rooms.length;
            const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;
            
            data.push({
                date,
                occupiedRooms,
                totalRooms,
                occupancyRate: occupancyRate.toFixed(1)
            });
        });
        
        return data;
    }
    
    generateRevenueReport(fromDate, toDate) {
        const dateRange = this.getDateRange(fromDate, toDate);
        const data = [];
        
        dateRange.forEach(date => {
            const dailyRevenue = this.data.reservations
                .filter(res => res.checkIn <= date && res.checkOut > date && 
                    (res.status === 'checked-in' || res.status === 'confirmed'))
                .reduce((total, res) => {
                    const room = this.data.rooms.find(r => r.id === res.roomId);
                    return total + (room ? room.price : 0);
                }, 0);
            
            data.push({ date, revenue: dailyRevenue });
        });
        
        return data;
    }
    
    generateGuestActivityReport(fromDate, toDate) {
        const newGuests = this.data.guests.filter(guest => {
            const firstReservation = this.data.reservations
                .filter(res => res.guestId === guest.id)
                .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn))[0];
            
            return firstReservation && 
                   firstReservation.checkIn >= fromDate && 
                   firstReservation.checkIn <= toDate;
        });
        
        const returningGuests = this.data.reservations
            .filter(res => res.checkIn >= fromDate && res.checkIn <= toDate)
            .map(res => res.guestId)
            .filter((guestId, index, arr) => arr.indexOf(guestId) !== index)
            .filter((guestId, index, arr) => arr.indexOf(guestId) === index);
        
        return {
            newGuests: newGuests.length,
            returningGuests: returningGuests.length,
            totalGuests: this.data.guests.length,
            period: { from: fromDate, to: toDate }
        };
    }
    
    getDateRange(startDate, endDate) {
        const dates = [];
        const currentDate = new Date(startDate);
        const lastDate = new Date(endDate);
        
        while (currentDate <= lastDate) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return dates;
    }
    
    renderOccupancyReport(data) {
        const totalOccupancy = data.reduce((sum, day) => sum + parseFloat(day.occupancyRate), 0);
        const avgOccupancy = data.length > 0 ? (totalOccupancy / data.length).toFixed(1) : 0;
        
        return `
            <h3>Occupancy Report</h3>
            <div style="margin-bottom: 1rem;">
                <strong>Average Occupancy Rate: ${avgOccupancy}%</strong>
            </div>
            <table style="width: 100%; margin-top: 1rem;">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Occupied Rooms</th>
                        <th>Total Rooms</th>
                        <th>Occupancy Rate</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(day => `
                        <tr>
                            <td>${new Date(day.date).toLocaleDateString()}</td>
                            <td>${day.occupiedRooms}</td>
                            <td>${day.totalRooms}</td>
                            <td>${day.occupancyRate}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    renderRevenueReport(data) {
        const totalRevenue = data.reduce((sum, day) => sum + day.revenue, 0);
        const avgDaily = data.length > 0 ? (totalRevenue / data.length).toFixed(2) : 0;
        
        return `
            <h3>Revenue Report</h3>
            <div style="margin-bottom: 1rem;">
                <strong>Total Revenue: $${totalRevenue.toFixed(2)}</strong><br>
                <strong>Average Daily Revenue: $${avgDaily}</strong>
            </div>
            <table style="width: 100%; margin-top: 1rem;">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Daily Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(day => `
                        <tr>
                            <td>${new Date(day.date).toLocaleDateString()}</td>
                            <td>$${day.revenue.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    renderGuestActivityReport(data) {
        return `
            <h3>Guest Activity Report</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0;">
                <div style="padding: 1rem; background: #f8fafc; border-radius: 0.5rem; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold; color: #2563eb;">${data.newGuests}</div>
                    <div style="color: #64748b;">New Guests</div>
                </div>
                <div style="padding: 1rem; background: #f8fafc; border-radius: 0.5rem; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold; color: #059669;">${data.returningGuests}</div>
                    <div style="color: #64748b;">Returning Guests</div>
                </div>
                <div style="padding: 1rem; background: #f8fafc; border-radius: 0.5rem; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold; color: #d97706;">${data.totalGuests}</div>
                    <div style="color: #64748b;">Total Guests</div>
                </div>
            </div>
            <p style="color: #64748b; text-align: center;">Report Period: ${new Date(data.period.from).toLocaleDateString()} - ${new Date(data.period.to).toLocaleDateString()}</p>
        `;
    }
    
    // Export Functions
    exportReportCSV() {
        if (!this.currentReportData) {
            this.showAlert('No report data to export', 'danger');
            return;
        }
        
        let csvContent = '';
        const reportType = this.currentReportType;
        
        if (reportType === 'occupancy') {
            csvContent = 'Date,Occupied Rooms,Total Rooms,Occupancy Rate\n';
            csvContent += this.currentReportData.map(row => 
                `${row.date},${row.occupiedRooms},${row.totalRooms},${row.occupancyRate}%`
            ).join('\n');
        } else if (reportType === 'revenue') {
            csvContent = 'Date,Daily Revenue\n';
            csvContent += this.currentReportData.map(row => 
                `${row.date},$${row.revenue.toFixed(2)}`
            ).join('\n');
        } else if (reportType === 'guest-activity') {
            csvContent = 'Metric,Value\n';
            csvContent += `New Guests,${this.currentReportData.newGuests}\n`;
            csvContent += `Returning Guests,${this.currentReportData.returningGuests}\n`;
            csvContent += `Total Guests,${this.currentReportData.totalGuests}`;
        }
        
        this.downloadFile(csvContent, `${reportType}-report.csv`, 'text/csv');
    }
    
    exportReportPDF() {
        this.showAlert('PDF export feature requires additional library - CSV export is available', 'info');
    }
    
    exportAllData() {
        const data = {
            rooms: this.data.rooms,
            reservations: this.data.reservations,
            guests: this.data.guests,
            staff: this.data.staff,
            exportDate: new Date().toISOString()
        };
        
        const jsonContent = JSON.stringify(data, null, 2);
        this.downloadFile(jsonContent, 'hotel-data-backup.json', 'application/json');
        this.showAlert('Data exported successfully', 'success');
    }
    
    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
}

// Initialize the system when the page loads
let hotelSystem;
document.addEventListener('DOMContentLoaded', () => {
    hotelSystem = new HotelManagementSystem();
});