/**
 * Main config;
 */

export default {
  /**
   * Header label (application name);
   */
  APPNAME: 'BDO RU',
  /**
   * Front will try to find these servers in the responses from the backend;
   */
  SERVERS: [
    {
      name: 'auth',
      group: 'services',
      label: 'Авторизация',
    },
    {
      name: 'market',
      group: 'services',
      label: 'Аукцион',
    },
    {
      name: 'k1',
      group: 'game',
      label: 'Кальфеон-1',
    },
    {
      name: 'v1',
      group: 'game',
      label: 'Валенсия-1',
    },
    {
      name: 'm1',
      group: 'game',
      label: 'Медия-1',
    },
    {
      name: 'kam1',
      group: 'game',
      label: 'Камасильвия-1',
    }
  ],
  /**
   * Group servers by this obj <fieldset> with <legend> = label of therese group;
   */
  GROUPS: [{ name: 'game', label: 'Игра' }, { name: 'services', label: 'Сервисы' }]
}