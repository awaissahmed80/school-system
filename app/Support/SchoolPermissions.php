<?php

namespace App\Support;

use App\Enums\UserType;

class SchoolPermissions
{
    public const SchoolOwnerRole = 'school_owner';

    /**
     * Baseline school permissions available for tenant role builders.
     * School owners receive every permission in this list.
     *
     * @return list<string>
     */
    public static function all(): array
    {
        return [
            // Dashboard
            'dashboard.view',

            // Attendance
            'attendance.students.view',
            'attendance.students.manage',
            'attendance.staff.view',
            'attendance.staff.manage',

            // Students
            'students.view',
            'students.manage',
            'students.admissions.view',
            'students.admissions.manage',
            'students.proctors.view',
            'students.proctors.manage',

            // Guardians
            'guardians.view',
            'guardians.manage',

            // Staff
            'staff.view',
            'staff.manage',
            'teachers.view',
            'teachers.manage',
            'staff.jobs.view',
            'staff.jobs.manage',
            'staff.leaves.view',
            'staff.leaves.manage',
            'staff.performance.view',
            'staff.performance.manage',

            // Finance
            'finance.dashboard.view',
            'finance.fees.view',
            'finance.fees.manage',
            'finance.payroll.view',
            'finance.payroll.manage',
            'finance.expenses.view',
            'finance.expenses.manage',

            // Academics
            'academics.classes.view',
            'academics.classes.manage',
            'academics.subjects.view',
            'academics.subjects.manage',
            'academics.curriculum.view',
            'academics.curriculum.manage',
            'academics.syllabus.view',
            'academics.syllabus.manage',
            'academics.calendar.view',
            'academics.calendar.manage',
            'academics.homework.view',
            'academics.homework.manage',
            'academics.timetable.view',
            'academics.timetable.manage',
            'academics.terms.view',
            'academics.terms.manage',
            'academics.exams.view',
            'academics.exams.manage',
            'academics.results.view',
            'academics.results.manage',
            'academics.grading.view',
            'academics.grading.manage',
            'academics.reports.view',

            // School management
            'school.campuses.view',
            'school.campuses.manage',
            'school.sessions.view',
            'school.sessions.manage',
            'school.fee_packages.view',
            'school.fee_packages.manage',
            'school.discounts.view',
            'school.discounts.manage',
            'school.classrooms.view',
            'school.classrooms.manage',
            'school.departments.view',
            'school.departments.manage',
            'school.calendar.view',
            'school.calendar.manage',

            // Assets
            'assets.view',
            'assets.manage',
            'assets.inventory.view',
            'assets.inventory.manage',
            'assets.suppliers.view',
            'assets.suppliers.manage',
            'assets.purchase_orders.view',
            'assets.purchase_orders.manage',
            'assets.reports.view',

            // Events
            'events.view',
            'events.manage',

            // Users & settings
            'users.view',
            'users.manage',
            'roles.view',
            'roles.manage',
            'audit_logs.view',
            'settings.view',
            'settings.manage',
        ];
    }

    public static function schoolOwnerGuard(): string
    {
        return UserType::SchoolOwner->guardName();
    }
}
