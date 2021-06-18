import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
const resources = {
  en: {
    translation: {
      "Welcome to React": "Welcome to React and react-i18next",
      'NOTIFICATION.NODE_UPDATED': `✓ Node «{{nodeName}}» (ID: {{nodeId}}) successfully updated`,
      'NOTIFICATION.NODE_CREATED': `✓ Node «{{nodeName}}» successfully created`,
      'NOTIFICATION.NODE_DELETED': `✓ Node «{{nodeName}}» successfully deleted`,
      'NOTIFICATION.NODES_DELETED': `✓ Nodes «{{nodeNames}}» successfully deleted`,
      'NOTIFICATION.SORTED_BY_NAME': `✓ Sorted by name`,
      'NOTIFICATION.SORTED_BY_PARENT': `✓ Sorted by parent`,
      'NOTIFICATION.SORTED_BY_PORT': `✓ Sorted by port`,
      'NOTIFICATION.SORTED_BY_ID': `✓ Sorted by id`,
      'NOTIFICATION.SORTED_BY_IP': `✓ Sorted by ip`,
    }
  },
  fr: {
    translation: {
      "Welcome to React": "Bienvenue à React et react-i18next"
    }
  },
  ru: {
    translation: {
        'Chat': 'Чат',
        'Nothing is found': 'Ничего не найдено',
        'Hierarchy': 'Иерархия',
        'Table': 'Таблица',
        'Search': 'Поиск',
        'Nodes hierarchy': 'Иерархия узлов',
        'Node edit': 'Редактирование узла',
        'Node name': 'Имя узла',
        'IP address': 'IP адрес',
        'IP-address': 'IP-адрес',
        'Web-port': 'Web-порт',
        'Save': 'Сохранить',
        'Cancel': 'Отменить',
        'Sort': 'Сортировать',
        'Name': 'Имя',
        'Port': 'Порт',
        'Ascending': 'По возрастанию',
        'Descending': 'По убыванию',
        'Port is incorrect': 'Значение порта введено неверно',
        'IP address is incorrect': 'Значение IP-адреса ведено неверно',
        'Node': 'Узел',
        'Parent': 'Родитель',
        'Create': 'Создать',
        'Close': 'Закрыть',
        'New node': 'Новый узел',
        'Do you want to delete node': 'Удалить узел',
        'Delete': 'Удалить',
        'Node delete': 'Удаление узла',
        'NOTIFICATION.NODE_UPDATED': `✓ Узел «{{nodeName}}» (ID: {{nodeId}}) успешно обновлён`,
        'NOTIFICATION.NODE_CREATED': `✓ Узел «{{nodeName}}» успешно создан`,
        'NOTIFICATION.NODE_DELETED': `✓ Узел «{{nodeName}}» успешно удалён`,
        'NOTIFICATION.NODES_DELETED': `✓ Узлы «{{nodeNames}}» успешно удалены`,
        'NOTIFICATION.SORTED_BY_NAME': `✓ Отсортировано по имени`,
        'NOTIFICATION.SORTED_BY_PARENT': `✓ Отсортировано по родителю`,
        'NOTIFICATION.SORTED_BY_PORT': `✓ Отсортировано по порту`,
        'NOTIFICATION.SORTED_BY_ID': `✓ Отсортировано по ID узла`,
        'NOTIFICATION.SORTED_BY_IP': `✓ Отсортировано по IP адресу`
    }
  },
};

i18n.use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLn: 'en',
    detection: {
        order: ['localStorage', 'querystring', 'navigator'],
    },
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;