/**
 * Portal sidebar navigation.
 *
 * Group shape:
 * {
 *   id: string,
 *   title: string,
 *   defaultOpen?: boolean,
 *   items: Array<{
 *     id: string,
 *     label: string,
 *     to: string,
 *     icon: string,
 *     end?: boolean,
 *   }>
 * }
 */
export const menuItems = [
    {
        id: 'main',
        title: 'Main',
        defaultOpen: true,
        items: [
            {
                id: 'dashboard',
                label: 'Dashboard',
                to: '/',
                icon: 'dashboard-2-line',
                end: true,
            },
        ],
    },
    {
        id: 'students',
        title: 'Students',
        items: [
            {
                id: 'students-all',
                label: 'All Students',
                to: '/students',
                icon: 'user-3-line',
            },
            {
                id: 'admissions',
                label: 'Admissions',
                to: '/admissions',
                icon: 'user-add-line',
            },
            {
                id: 'student-attendance',
                label: 'Attendance',
                to: '/students/attendance',
                icon: 'calendar-check-line',
            },
            {
                id: 'proctors',
                label: 'Proctors & Prefects',
                to: '/students/proctors',
                icon: 'award-line',
            },
        ],
    },
    {
        id: 'staff',
        title: 'Staff',
        items: [
            {
                id: 'staff-all',
                label: 'All Staff',
                to: '/staff',
                icon: 'team-line',
            },
            {
                id: 'teachers',
                label: 'Teachers',
                to: '/staff/teachers',
                icon: 'presentation-line',
            },
            {
                id: 'staff-attendance',
                label: 'Attendance',
                to: '/staff/attendance',
                icon: 'calendar-check-line',
            },
            {
                id: 'staff-leaves',
                label: 'Leaves',
                to: '/staff/leaves',
                icon: 'calendar-event-line',
            },
        ],
    },
    {
        id: 'guardians',
        title: 'Parents & Guardians',
        items: [
            {
                id: 'guardians-all',
                label: 'All Guardians',
                to: '/guardians',
                icon: 'parent-line',
            },
        ],
    },
    {
        id: 'academics',
        title: 'Academics',
        items: [
            {
                id: 'classes',
                label: 'Classes',
                to: '/academics/classes',
                icon: 'building-line',
            },
            {
                id: 'subjects',
                label: 'Subjects',
                to: '/academics/subjects',
                icon: 'book-open-line',
            },
            {
                id: 'timetable',
                label: 'Timetable',
                to: '/academics/timetable',
                icon: 'calendar-schedule-line',
            },
            {
                id: 'exams',
                label: 'Exams & Results',
                to: '/academics/exams',
                icon: 'file-list-3-line',
            },
            {
                id: 'homework',
                label: 'Homework',
                to: '/academics/homework',
                icon: 'todo-line',
            },
        ],
    },
    {
        id: 'finance',
        title: 'Accounts & Finance',
        items: [
            {
                id: 'finance-dashboard',
                label: 'Overview',
                to: '/finance',
                icon: 'wallet-3-line',
            },
            {
                id: 'fees',
                label: 'Fees',
                to: '/finance/fees',
                icon: 'money-dollar-circle-line',
            },
            {
                id: 'payroll',
                label: 'Payroll',
                to: '/finance/payroll',
                icon: 'bank-card-line',
            },
            {
                id: 'expenses',
                label: 'Expenses',
                to: '/finance/expenses',
                icon: 'refund-2-line',
            },
        ],
    },
    {
        id: 'events',
        title: 'Events & Activities',
        items: [
            {
                id: 'events-all',
                label: 'All Events',
                to: '/events',
                icon: 'calendar-event-line',
            },
        ],
    },
    {
        id: 'analytics',
        title: 'Analytics',
        items: [
            {
                id: 'reports',
                label: 'Reports',
                to: '/reports',
                icon: 'bar-chart-box-line',
            },
            {
                id: 'academic-reports',
                label: 'Academic Reports',
                to: '/reports/academic',
                icon: 'file-chart-line',
            },
        ],
    },
    {
        id: 'administration',
        title: 'Administration',
        items: [
            {
                id: 'campuses',
                label: 'Campuses',
                to: '/school/campuses',
                icon: 'building-2-line',
            },
            {
                id: 'sessions',
                label: 'Sessions',
                to: '/school/sessions',
                icon: 'calendar-2-line',
            },
            {
                id: 'users-roles',
                label: 'Users & Roles',
                to: '/users',
                icon: 'shield-user-line',
            },
            {
                id: 'settings',
                label: 'Settings',
                to: '/settings',
                icon: 'settings-3-line',
            },
        ],
    },
];

/** @deprecated Use `menuItems` */
export const menu_items = menuItems;
