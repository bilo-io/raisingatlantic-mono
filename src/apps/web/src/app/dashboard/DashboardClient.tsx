
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Baby, BookOpen, PlusCircle, Users, Award, ShieldCheck, UserCheck, Zap, User, Settings, Shield, ClipboardList, FileText, Syringe, Stethoscope, Building, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RoleAvatar } from "@/components/ui/RoleAvatar";
import { UserRole } from "@/lib/constants";
import { addMonths, isSameMonth, differenceInMonths } from "date-fns";
import { getAgeFromDate } from "@/lib/utils/date";
import { useApi, withDataSource } from "@/lib/api/data-source";
import { 
  getChildren, 
  Child as ChildType 
} from "@/lib/api/adapters/child.adapter";
import { 
  getUsers, 
  getClinicians 
} from "@/lib/api/adapters/user.adapter";
import { 
  getMilestones, 
  getVaccinationSchedule 
} from "@/lib/api/adapters/master-data.adapter";
import { 
  getCliniciansForVerification, 
  getRecordsForVerification 
} from "@/lib/api/adapters/verification.adapter";

const parseAgeString = (ageString: string): number | null => {
    if (ageString.toLowerCase() === 'birth') return 0;
    const match = ageString.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : null;
};

interface DashboardClientProps {
  initialServerData?: any;
}

export default function DashboardClient({ initialServerData }: DashboardClientProps) {
  const [currentUser, setCurrentUser] = useState<any | undefined>();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Data state
  const [children, setChildren] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [vaccinations, setVaccinations] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [cliniciansToVerifyState, setCliniciansToVerify] = useState<any[]>([]);
  const [recordsToVerifyState, setRecordsToVerify] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        // 1. Identify User
        let user: any;
        if (initialServerData?.userId) {
           const allUsers = await getUsers();
           user = allUsers.find((u: any) => u.id === initialServerData.userId);
        }
        
        if (!user && typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('currentUserId') || 'user-1';
            const allUsers = await getUsers();
            user = allUsers.find((u: any) => u.id === storedUserId);
        }

        if (user) {
          setCurrentUser(user);
          
          // 2. Fetch all other dashboard dependencies in parallel
          const [
            allChildren,
            allUsers,
            allVaccinations,
            allMilestones,
            pendingClinicians,
            pendingRecords
          ] = await Promise.all([
            getChildren(),
            getUsers(),
            getVaccinationSchedule(),
            getMilestones(),
            getCliniciansForVerification(),
            getRecordsForVerification()
          ]);

          setChildren(allChildren);
          setUsers(allUsers);
          setVaccinations(allVaccinations);
          setMilestones(allMilestones);
          setCliniciansToVerify(pendingClinicians);
          setRecordsToVerify(pendingRecords);
        }
      } catch (err: any) {
        console.error("Dashboard data load failed:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [initialServerData]);

  const {
    stats,
    welcomeTitle,
    welcomeDescription,
    mainList,
    mainListTitle,
    mainListDescription,
    quickActions,
    mainListLink
  } = useMemo(() => {
    if (!currentUser) return { stats: [], quickActions: [], mainList: [], mainListLink: '' };

    const role = currentUser.role;
    
    // Parent-specific data
    if (role === UserRole.PARENT) {
      const myChildren = children.filter(c => c.parentId === currentUser.id);
      const currentDate = new Date();
      
      let upcomingVaccinationsCount = 0;
      let dueMilestonesCount = 0;
      let dueGrowthRecordsCount = 0;
      
      const growthCheckupMonths = [2, 4, 6, 9, 12, 15, 18, 24, 30, 36, 48, 60, 72];

      myChildren.forEach(child => {
        // Calculate upcoming vaccinations for the current month
        vaccinations.forEach(vaccine => {
          const isCompleted = (child.completedVaccinations || []).some((cv: any) => cv.vaccineId === vaccine.id);
          if (!isCompleted) {
            const dueInMonths = parseAgeString(vaccine.recommendedAge);
            if (dueInMonths !== null) {
              const dueDate = addMonths(new Date(child.dateOfBirth), dueInMonths);
              if (isSameMonth(dueDate, currentDate)) {
                upcomingVaccinationsCount++;
              }
            }
          }
        });

        // Calculate due milestones for the current month
        milestones.forEach(ageGroup => {
          const dueInMonths = parseAgeString(ageGroup.age);
          if (dueInMonths !== null) {
            const dueDate = addMonths(new Date(child.dateOfBirth), dueInMonths);
            if (isSameMonth(dueDate, currentDate)) {
              const uncompletedMilestones = ageGroup.milestones.filter((m: any) => !(child.completedMilestones || []).some((cm: any) => cm.milestoneId === m.id));
              dueMilestonesCount += uncompletedMilestones.length;
            }
          }
        });
        
        // Calculate due growth records for the current month
        const childAgeInMonths = differenceInMonths(currentDate, new Date(child.dateOfBirth));
        if (growthCheckupMonths.includes(childAgeInMonths)) {
            const hasRecordForCheckupMonth = (child.growthRecords || []).some((r: any) => 
                isSameMonth(new Date(r.date), addMonths(new Date(child.dateOfBirth), childAgeInMonths))
            );
            if (!hasRecordForCheckupMonth) {
                dueGrowthRecordsCount++;
            }
        }
      });
      
      const uniqueClinicianIds = [...new Set(myChildren.map(c => c.clinicianId).filter(Boolean))];
      const assignedClinicians = uniqueClinicianIds.map(id => users.find(u => u.id === id)).filter(Boolean);

      return {
        welcomeTitle: `Welcome back, ${currentUser.name}!`,
        welcomeDescription: "Here's a quick overview of your children's progress and recent activity.",
        stats: [
          { title: "My Children", value: myChildren.length, icon: Baby, change: "All active", href: "/dashboard/children" },
          { 
            title: "My Clinicians", 
            value: assignedClinicians.length, 
            href: "/dashboard/directory/clinicians",
            change: `${assignedClinicians.length} assigned`,
            clinicians: assignedClinicians
          },
          { title: "Upcoming Vaccinations", value: upcomingVaccinationsCount, icon: Syringe, change: "Due this month", href: "/dashboard/records/vaccinations" },
          { 
            title: "Growth & Milestones Due", 
            icon: ClipboardList, 
            change: "This month",
            type: 'multi-value',
            values: [
                { label: 'Growth', value: dueGrowthRecordsCount, href: '/dashboard/records/growth' },
                { label: 'Milestones', value: dueMilestonesCount, href: '/dashboard/records/milestones' }
            ]
          },
        ],
        mainListTitle: "My Children",
        mainListDescription: "Overview of your children with recent profile updates or activity.",
        mainList: myChildren.slice(0, 3),
        mainListLink: "/dashboard/children",
        quickActions: [
          { label: "Add New Child", href: "/dashboard/children/new", icon: PlusCircle },
          { label: "View All Records", href: "/dashboard/records", icon: ClipboardList },
          { label: "Manage My Account", href: "/dashboard/account", icon: User },
          { label: "Search Directory", href: "/dashboard/directory", icon: Search },
        ]
      };
    }

    // Clinician-specific data
    if (role === UserRole.CLINICIAN) {
      const myPatients = children.filter(c => c.clinicianId === currentUser.id);
      const currentDate = new Date();

      // Upcoming Vaccinations Logic
      let upcomingVaccinationsCount = 0;
      myPatients.forEach(child => {
        vaccinations.forEach(vaccine => {
          const isCompleted = (child.completedVaccinations || []).some((cv: any) => cv.vaccineId === vaccine.id);
          if (!isCompleted) {
            const dueInMonths = parseAgeString(vaccine.recommendedAge);
            if (dueInMonths !== null) {
              const dueDate = addMonths(new Date(child.dateOfBirth), dueInMonths);
              if (isSameMonth(dueDate, currentDate)) {
                upcomingVaccinationsCount++;
              }
            }
          }
        });
      });

      // All Parents Logic
      const parentIds = [...new Set(myPatients.map(p => p.parentId))];
      const associatedParents = parentIds.map(id => users.find(u => u.id === id)).filter(Boolean);

      return {
        welcomeTitle: `Welcome back, ${(currentUser.title || '') + ' ' + currentUser.name}!`,
        welcomeDescription: "Here's an overview of your patients and pending tasks.",
        stats: [
          { title: "My Patients", value: myPatients.length, icon: Users, change: "Assigned to you", href: "/dashboard/patients" },
          { 
            title: "Associated Parents", 
            value: associatedParents.length, 
            href: "/dashboard/admin/users",
            change: `${associatedParents.length} linked`,
            clinicians: associatedParents, // Re-using 'clinicians' key for avatar stack
          },
          { title: "Upcoming Vaccinations", value: upcomingVaccinationsCount, icon: Syringe, change: "Due this month", href: "/dashboard/records/vaccinations" },
          { title: "Pending Verifications", value: cliniciansToVerifyState.length, icon: ShieldCheck, change: "Awaiting review", href: "/dashboard/verifications" },
        ],
        mainListTitle: "My Recently Active Patients",
        mainListDescription: "Patients with recent profile updates or activity.",
        mainList: myPatients.slice(0, 3),
        mainListLink: "/dashboard/patients",
        quickActions: [
          { label: "View Patient List", href: "/dashboard/patients", icon: Users },
          { label: "Manage Verifications", href: "/dashboard/verifications", icon: ShieldCheck },
          { label: "Manage My Profile", href: "/dashboard/account/profile", icon: User },
          { label: "Search Directory", href: "/dashboard/directory", icon: Search },
        ]
      };
    }
    
    // Admin-specific data
    if (role === UserRole.ADMIN) {
       const pendingVerifications = cliniciansToVerifyState.length + recordsToVerifyState.length;
       const totalClinicians = users.filter((u: any) => u.role === UserRole.CLINICIAN).length;
       const totalParents = users.filter((u: any) => u.role === UserRole.PARENT).length;
       return {
        welcomeTitle: "Administrator Dashboard",
        welcomeDescription: "Manage users, monitor system health, and oversee platform operations.",
        stats: [
          { title: "Total Clinicians", value: totalClinicians, icon: Stethoscope, change: "Platform-wide", href: "/dashboard/admin/users" },
          { title: "Total Parents", value: totalParents, icon: Users, change: "Platform-wide", href: "/dashboard/admin/users" },
          { title: "Total Children", value: children.length, icon: Baby, change: "Platform-wide", href: "/dashboard/patients" },
          { title: "Pending Verifications", value: pendingVerifications, icon: UserCheck, change: "Need review", href: "/dashboard/verifications" },
        ],
        mainListTitle: "Pending Verifications",
        mainListDescription: "Items that require immediate attention and review.",
        mainList: cliniciansToVerifyState.slice(0, 3),
        mainListLink: "/dashboard/verifications/clinicians",
        quickActions: [
          { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
          { label: "System Settings", href: "/dashboard/admin/system", icon: Settings },
          { label: "Oversee Verifications", href: "/dashboard/verifications", icon: ShieldCheck },
          { label: "Full Audit Log", href: "#", icon: FileText },
        ]
       }
    }
    
    // SuperAdmin-specific data
    if (role === UserRole.SUPER_ADMIN) {
        const pendingVerifications = cliniciansToVerifyState.length + recordsToVerifyState.length;
        const totalUsers = users.length;
        // For Tenants/Practices we might need more adapters or just keep mock for now
        // But let's assume we can at least show the basic stats
        return {
         welcomeTitle: "Super Administrator Dashboard",
         welcomeDescription: "Oversee the entire platform, including all tenants, users, and system settings.",
         stats: [
           { title: "Total Tenants", value: 0, icon: Building, change: "Platform-wide", href: "/dashboard/tenants" },
           { title: "Total Practices", value: 0, icon: Stethoscope, change: "Across all tenants", href: "/dashboard/directory/practices" },
           { title: "Total Users", value: totalUsers, icon: Users, change: "All roles", href: "/dashboard/admin/users" },
           { title: "Pending Verifications", value: pendingVerifications, icon: UserCheck, change: "Need review", href: "/dashboard/verifications" },
         ],
         mainListTitle: "Recently Active Items",
         mainListDescription: "Overview of activity on the platform.",
         mainList: [], // Snapshot
         mainListLink: "/dashboard/admin/users",
         quickActions: [
           { label: "Manage Tenants", href: "/dashboard/tenants", icon: Building },
           { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
           { label: "System Settings", href: "/dashboard/admin/system", icon: Settings },
           { label: "Oversee Verifications", href: "/dashboard/verifications", icon: ShieldCheck },
         ]
        }
    }

    return { welcomeTitle: 'Dashboard', welcomeDescription: '', stats: [], quickActions: [], mainList: [], mainListTitle: '', mainListDescription: '', mainListLink: '#'};
  }, [currentUser, children, users, vaccinations, milestones, cliniciansToVerifyState, recordsToVerifyState]);

  if (error) {
    throw error;
  }

  if (!mounted || loading || !currentUser) {
    return (
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-96 xl:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">{welcomeTitle}</h1>
        <p className="text-muted-foreground">{welcomeDescription}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat: any, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.clinicians && stat.clinicians.length > 0 ? (
                <div className="flex items-center">
                    {stat.clinicians.length === 1 ? (
                             <RoleAvatar
                            src={stat.clinicians[0].imageUrl}
                            name={stat.clinicians[0].name}
                            role={stat.clinicians[0].role}
                            avatarClassName="h-8 w-8"
                            iconContainerClassName="h-5 w-5 border-2"
                            iconClassName="h-3 w-3"
                        />
                    ) : (
                        <div className="flex items-center">
                            <div className="flex -space-x-4 rtl:space-x-reverse">
                                {stat.clinicians.slice(0, 2).map((c: any) => (
                                     <RoleAvatar
                                      key={c.id}
                                      src={c.imageUrl}
                                      name={c.name}
                                      role={c.role}
                                      avatarClassName="h-8 w-8 border-background"
                                      iconContainerClassName="h-5 w-5 border-2"
                                      iconClassName="h-3 w-3"
                                    />
                                ))}
                            </div>
                            {stat.clinicians.length > 2 && (
                                <span className="pl-2 text-sm font-medium text-muted-foreground">
                                    +{stat.clinicians.length - 2}
                                </span>
                            )}
                        </div>
                    )}
                </div>
              ) : stat.icon ? (
                <stat.icon className="h-6 w-6 text-primary" />
              ) : null}
            </CardHeader>
            <CardContent className="text-center">
              {stat.type === 'multi-value' && stat.values ? (
                  <div className="flex justify-around items-center pt-2">
                    {stat.values.map((v: any) => (
                      <div key={v.label} className="text-center">
                        <Link href={v.href} className="text-2xl font-bold hover:underline text-primary">{v.value}</Link>
                        <p className="text-xs text-muted-foreground">{v.label}</p>
                      </div>
                    ))}
                  </div>
              ) : (
                <>
                  {stat.href ? (
                    <Link href={stat.href} className="text-2xl font-bold hover:underline text-primary">{stat.value}</Link>
                  ) : (
                    <div className="text-2xl font-bold">{stat.value}</div>
                  )}
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="font-headline">{mainListTitle}</CardTitle>
            <CardDescription>{mainListDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mainList.length > 0 ? mainList.map((item: any) => ( // Using any for polymorphic list
              <div key={item.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50">
                {item.role ? (
                    <RoleAvatar
                        src={item.imageUrl}
                        name={item.name}
                        role={item.role}
                        avatarClassName="h-10 w-10"
                        iconContainerClassName="h-5 w-5 border-2"
                        iconClassName="h-3 w-3"
                    />
                ) : ( // Fallback for items that don't have a role (like Tenants)
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={item.logoUrl || item.imageUrl || item.avatar} alt={item.name} />
                        <AvatarFallback name={item.name}>{item.name.split(' ').map((n: any) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                )}
                 <div className="grid gap-1 flex-1">
                  <Link href={`/dashboard/children/${item.id}`} className="font-semibold hover:underline">{(item.title || '') + ' ' + item.name}</Link>
                  <p className="text-xs text-muted-foreground">{item.dateOfBirth ? getAgeFromDate(item.dateOfBirth) : (item.specialty || item.email)}</p>
                 </div>
                 {currentUser.role === UserRole.PARENT && (
                  <>
                    <div className="w-1/3">
                      <Progress value={item.progress} aria-label={`${item.name} progress ${item.progress}%`} className="h-2" />
                      <p className="text-xs text-muted-foreground text-right mt-1">{item.progress}% complete</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/children/${item.id}`}>View</Link>
                    </Button>
                  </>
                 )}
                 {currentUser.role !== UserRole.PARENT && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={mainListLink}>Review</Link>
                  </Button>
                 )}
              </div>
            )) : <p className="text-center text-muted-foreground py-8">No items to display.</p>}
          </CardContent>
          {mainList.length > 0 && (
             <CardFooter>
               <Button variant="link" asChild className="mx-auto">
                 <Link href={mainListLink}>View All</Link>
               </Button>
            </CardFooter>
          )}
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="font-headline">Quick Actions</CardTitle>
            <CardDescription>Access common tasks quickly.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {quickActions.map((action, index) => (
              <Button key={index} variant="outline" className="justify-start" asChild>
                <Link href={action.href}>
                  <action.icon className="mr-2 h-4 w-4" /> {action.label}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    
