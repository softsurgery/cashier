export const data = {
  user: {
    name: 'superadmin',
    email: 'superadmin@example.com',
    avatar: '/assets/avatar.png',
  },
  navMain: [
    {
      title: 'Accueil',
      url: '/accueil',
      icon: 'lucideBot',
      isActive: true,
    },
    {
      title: 'Caisse',
      url: '/caisse',
      icon: 'lucideWallet',
      isActive: false,
    },
    {
      title: 'Commandes',
      url: '/orders',
      icon: 'lucideShoppingCart',
      isActive: false,
    },

    {
      title: 'Tables',
      url: '/zone-tables',
      icon: 'lucideGrid',
      isActive: false,
    },

    {
      title: 'Consulter Z',
      url: '/consulter-z',
      icon: 'lucideFileText',
      isActive: false,
    },
    {
      title: 'Utilisateurs',
      url: '/utilisateurs',
      icon: 'lucideUsers',
      isActive: false,
    },
    {
      title: 'Statistique',
      url: '/statistique',
      icon: 'lucideBarChart',
      isActive: false,
    },
    {
      title: 'Stocks',
      url: '/stocks',
      icon: 'lucideBox',
      isActive: false,
    },
    {
      title: 'Ngrok',
      url: '/ngrok',
      icon: 'lucideSettings',
      isActive: false,
    },
    {
      title: 'Administrative Tools',
      icon: 'lucideShield',
      items: [
        {
          title: 'Table',
          url: '/tables',
        },
        {
          title: 'Table Zones',
          url: '/table-zone',
        },
        {
          title: 'Produits',
          url: '/produits',
        },
        {
          title: 'Familles',
          url: '/familles',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '.',
      icon: 'lucideLifeBuoy',
    },
    {
      title: 'Feedback',
      url: '.',
      icon: 'lucideSend',
    },
  ],
};
