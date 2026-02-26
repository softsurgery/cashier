export const data = {
  user: {
    name: 'superadmin',
    email: 'superadmin@example.com',
    avatar: '/assets/avatar.png',
  },
  navMain: [
    {
      title: 'Acceuil',
      url: '.',
      icon: 'lucideBot',
      isActive: true,
      items: [
        {
          title: 'New Workflow',
          url: 'playground/new-workflow',
        },
        {
          title: 'Saved Workflows',
          url: 'playground/saved-workflows',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '.',
      icon: 'lucideBookOpen',
      items: [
        {
          title: 'Introduction',
          url: '.',
        },
        {
          title: 'Get Started',
          url: '.',
        },
        {
          title: 'Tutorials',
          url: '.',
        },
        {
          title: 'Changelog',
          url: '.',
        },
      ],
    },
    {
      title: 'Settings',
      url: '.',
      icon: 'lucideSettings2',
      items: [
        {
          title: 'General',
          url: '.',
        },
        {
          title: 'Team',
          url: '.',
        },
        {
          title: 'Billing',
          url: '.',
        },
        {
          title: 'Limits',
          url: '.',
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
  projects: [
    // {
    //   name: "Design Engineering",
    //   url: ".",
    //   icon: "lucideFrame",
    // },
    // {
    //   name: "Sales & Marketing",
    //   url: ".",
    //   icon: "lucideChartPie",
    // },
    // {
    //   name: "Travel",
    //   url: ".",
    //   icon: "lucideMap",
    // },
  ],
};
