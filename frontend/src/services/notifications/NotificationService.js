class NotificationService {
  constructor() {
    this.notifications = [];
    this.listeners = [];
    this.nextId = 1;
  }

  // Dodaj listener do zmian w notyfikacjach
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Powiadom wszystkich słuchaczy o zmianach
  notify() {
    this.listeners.forEach(callback => callback(this.notifications));
  }

  // Dodaj notyfikację
  add(notification) {
    const newNotification = {
      id: this.nextId++,
      timestamp: new Date(),
      isRead: false,
      ...notification
    };

    this.notifications.unshift(newNotification);
    this.notify();

    // Auto-remove dla toastów
    if (notification.type === 'toast' && notification.autoRemove !== false) {
      setTimeout(() => {
        this.remove(newNotification.id);
      }, notification.duration || 5000);
    }

    return newNotification.id;
  }

  // Usuń notyfikację
  remove(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notify();
  }

  // Oznacz jako przeczytaną
  markAsRead(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
      this.notify();
    }
  }

  // Oznacz wszystkie jako przeczytane
  markAllAsRead() {
    this.notifications.forEach(n => n.isRead = true);
    this.notify();
  }

  // Wyczyść wszystkie
  clear() {
    this.notifications = [];
    this.notify();
  }

  // Pobierz wszystkie
  getAll() {
    return this.notifications;
  }

  // Pobierz nieprzeczytane
  getUnread() {
    return this.notifications.filter(n => !n.isRead);
  }

  // Metody pomocnicze dla różnych typów notyfikacji
  success(message, options = {}) {
    return this.add({
      type: 'toast',
      variant: 'success',
      title: 'Sukces',
      message,
      ...options
    });
  }

  error(message, options = {}) {
    return this.add({
      type: 'toast',
      variant: 'error',
      title: 'Błąd',
      message,
      duration: 7000,
      ...options
    });
  }

  warning(message, options = {}) {
    return this.add({
      type: 'toast',
      variant: 'warning',
      title: 'Ostrzeżenie',
      message,
      ...options
    });
  }

  info(message, options = {}) {
    return this.add({
      type: 'toast',
      variant: 'info',
      title: 'Informacja',
      message,
      ...options
    });
  }

  // Notyfikacje systemowe (pojawiają się w dzwonku)
  system(message, options = {}) {
    return this.add({
      type: 'system',
      variant: 'info',
      title: 'Powiadomienie systemowe',
      message,
      autoRemove: false,
      ...options
    });
  }

  // Notyfikacje o lekcjach
  lesson(message, options = {}) {
    return this.add({
      type: 'system',
      variant: 'lesson',
      title: 'Powiadomienie o lekcji',
      message,
      autoRemove: false,
      ...options
    });
  }

  // Notyfikacje o rejestracjach (dla adminów)
  registration(message, options = {}) {
    return this.add({
      type: 'system',
      variant: 'registration',
      title: 'Nowa rejestracja',
      message,
      autoRemove: false,
      ...options
    });
  }
}

export default new NotificationService();