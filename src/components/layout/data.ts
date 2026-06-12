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
      title: 'Content Management',
      icon: 'lucideFileText',
      items: [
        {
          title: 'Table',
          url: '/tables',
          icon: 'lucideGrid2X2Check',
        },
        {
          title: 'Table Zones',
          url: '/table-zone',
          icon: 'lucideGrid',
        },
        {
          title: 'Produits',
          url: '/produits',
          icon: 'lucideHamburger',
        },
        {
          title: 'Product Families',
          url: '/familles',
          icon: 'lucidePackage',
        },
      ],
    },
    {
      title: 'User Management',
      url: '/user-management',
      icon: 'lucideUsers',
      items: [
        {
          title: 'Users',
          url: '/users',
          icon: 'lucideUsers',
        },
        {
          title: 'Roles',
          url: '/roles',
          icon: 'lucideShield',
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
