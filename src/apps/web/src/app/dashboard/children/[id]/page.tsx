"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit3, FileText, PlusCircle, Trash2, CalendarDays, User, ArrowLeft, ClipboardList, TrendingUp, Award, ShieldPlus, List, BarChart2, Mars, Venus, ChevronDown, Cake, FileDown, MoreHorizontal, Stethoscope } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { childrenDetails, type ChildDetail } from '@/data/children';
import { formatDateStandard, formatDatePretty } from '@/utils/date';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { UserRole } from '@/lib/constants';

import { DUMMY_DEFAULT_USER_ID, dummyUsers, type User as UserType } from '@/data/users';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { boysWeightForAgeData } from '@/data/charts/boys-weight-for-age';
import { girlsWeightForAgeData } from '@/data/charts/girls-weight-for-age';
import { boysHeightForAgeData } from '@/data/charts/boys-height-for-age';
import { girlsHeightForAgeData } from '@/data/charts/girls-height-for-age';
import { standardVaccinationSchedule } from '@/data/vaccinations';
import { standardMilestonesByAge } from '@/data/milestones';
import { cn } from '@/lib/utils';
import { differenceInMonths } from 'date-fns';
import { RoleAvatar } from '@/components/ui/RoleAvatar';
import { GrowthRecordFormModal } from '@/components/records/GrowthRecordFormModal';
import { useToast } from '@/hooks/useToast';
import { UserDetailModal } from '@/components/users/UserDetailModal';

export default function ChildProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const { addToast } = useToast();

  const profileCardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isGrowthModalOpen, setIsGrowthModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  
  const id = typeof params.id === 'string' ? params.id : '';
  const child = childrenDetails.find(child => child.id === id);
  
  const clinician = React.useMemo(() => {
    if (!child?.clinicianId) return null;
    return dummyUsers.find(u => u.id === child.clinicianId);
  }, [child?.clinicianId]);

  const parent = React.useMemo(() => {
    if (!child?.parentId) return null;
    return dummyUsers.find(u => u.id === child.parentId);
  }, [child?.parentId]);

  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [isDetailsCollapsed, setIsDetailsCollapsed] = useState(true);
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // State is now driven by URL query parameters
  const activeTab = searchParams.get('recordType') || 'vaccinations';
  const growthView = searchParams.get('growthView') || 'list';
  const chartMetric = searchParams.get('chartMetric') || 'weight';
  
  const allMilestoneAccordionValues = standardMilestonesByAge.map(g => g.age);


  useEffect(() => {
    const userId = localStorage.getItem('currentUserId') || DUMMY_DEFAULT_USER_ID;
    const user = dummyUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUserRole(user.role);
    }
    
    if (typeof window !== 'undefined' && id && !isInitialized) {
      const hasParamsInUrl = searchParams.has('recordType');
      
      if (!hasParamsInUrl) {
        const storedParamsRaw = localStorage.getItem(`childProfileViewParams-${id}`);
        if (storedParamsRaw) {
          const storedParams = JSON.parse(storedParamsRaw);
          const newSearchParams = new URLSearchParams();
          if (storedParams.recordType) newSearchParams.set('recordType', storedParams.recordType);
          if (storedParams.growthView) newSearchParams.set('growthView', storedParams.growthView);
          if (storedParams.chartMetric) newSearchParams.set('chartMetric', storedParams.chartMetric);

          const query = newSearchParams.toString();
          if (query) {
            router.replace(`${pathname}?${query}`, { scroll: false });
          }
        }
      }
      setIsInitialized(true);
    }
  }, [id, isInitialized, pathname, router, searchParams]);

  useEffect(() => {
    if (typeof window !== 'undefined' && id && isInitialized) {
      const recordType = searchParams.get('recordType');
      if (recordType) { // Only save if params are explicitly in URL
        const paramsToStore = {
          recordType: recordType,
          growthView: searchParams.get('growthView'),
          chartMetric: searchParams.get('chartMetric'),
        };
        localStorage.setItem(`childProfileViewParams-${id}`, JSON.stringify(paramsToStore));
      }
    }
  }, [searchParams, id, isInitialized]);
  
  const handleExportPdf = () => {
    if (!profileCardRef.current || !child) return;
    setIsDetailsCollapsed(false);
    setOpenAccordionItems(allMilestoneAccordionValues);
    setIsExporting(true); // This triggers the useEffect
  };

  useEffect(() => {
    if (isExporting && profileCardRef.current) {
        const timer = setTimeout(async () => {
            // Dynamic import: jsPDF (~250 kB gzipped) is only loaded on export click
            const { default: jsPDF } = await import('jspdf');
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'pt',
                format: 'a4',
            });
            try {
                const element = profileCardRef.current;
                if (!element || !child) return;
                
                await pdf.html(element, {
                    autoPaging: 'text',
                    margin: [40, 30, 40, 30],
                    width: 535,
                    windowWidth: 1200,
                });
                pdf.save(`${child.name.replace(/\s+/g, '-')}-profile.pdf`);
            } catch (error) {
                console.error("Error exporting PDF:", error);
            } finally {
                // Reset states after export
                setIsExporting(false);
                setIsDetailsCollapsed(true);
                setOpenAccordionItems([]);
            }
        }, 500); // Small delay to allow React to re-render with expanded content

        return () => clearTimeout(timer);
    }
  }, [isExporting, child?.name]);

  const updateUrlParams = (newParams: { [key: string]: string | null }) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`, { scroll: false });
  };
  
  const handleGrowthFormSubmit = (data: any) => {
    console.log("New growth record for child:", data);
    addToast({
        title: "Record Added!",
        description: `A new growth record for ${child?.name} has been created.`,
        type: 'success',
    });
    // In a real app, you would mutate your data here
  };


  const backLink = currentUserRole === UserRole.CLINICIAN ? '/dashboard/patients' : '/dashboard/children';
  const backText = currentUserRole === UserRole.CLINICIAN ? 'Back to Patients' : 'Back to Children List';
  const notFoundBackText = currentUserRole === UserRole.CLINICIAN ? 'Go Back to Patients' : 'Go Back to Children List';

  if (!child) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-2xl font-semibold mb-4">Child Profile Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find a profile for the specified ID.</p>
        {currentUserRole && (
          <Button asChild>
            <Link href={backLink}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {notFoundBackText}
            </Link>
          </Button>
        )}
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'Archived': return 'outline';
      default: return 'default';
    }
  };
  
  const childsGrowthData = React.useMemo(() => {
    if (!child) return [];
    return child.growthRecords.map(record => {
      const recordDate = new Date(record.date);
      const ageInMonths = differenceInMonths(recordDate, child.dateOfBirth);
      
      const weightStr = record.data.weight || '';
      const heightStr = record.data.height || '';
      
      const weight = parseFloat(weightStr.replace(/[^0-9.]/g, ''));
      const height = parseFloat(heightStr.replace(/[^0-9.]/g, ''));

      return {
        age: ageInMonths,
        weight: isNaN(weight) ? null : weight,
        height: isNaN(height) ? null : height,
      };
    }).sort((a, b) => a.age - b.age);
  }, [child]);

  const GrowthChart = ({ metric, child }: { metric: 'weight' | 'height', child: typeof childrenDetails[0] }) => {
    const chartConfig = React.useMemo(() => ({
      line_plus_3:  { label: "+3 line",  color: "var(--destructive)" },
      line_plus_2: { label: "+2 line", color: "#E68A19" },
      line_0: { label: "0-line (median)", color: "#21C45D" },
      line_minus_2: { label: "-2 line", color: "#E68A19" },
      line_minus_3: { label: "-3 line", color: "var(--destructive)" },
      childData: { label: child.name, color: "var(--primary)" },
    }), [child.name]) satisfies ChartConfig;

    const combinedChartData = React.useMemo(() => {
      const standardChartData = metric === 'height'
          ? (child.gender === 'male' ? boysHeightForAgeData : girlsHeightForAgeData)
          : (child.gender === 'male' ? boysWeightForAgeData : girlsWeightForAgeData);

      const childDataMap = new Map<number, { weight: number | null, height: number | null }>();
      childsGrowthData.forEach(d => {
        childDataMap.set(d.age, { weight: d.weight, height: d.height });
      });

      const mergedData = standardChartData.map(standardDataPoint => {
        const childDataForAge = childDataMap.get(standardDataPoint.age);
        const childMetricValue = childDataForAge
          ? (metric === 'weight' ? childDataForAge.weight : childDataForAge.height)
          : null;

        return {
          ...standardDataPoint,
          childData: childMetricValue,
        };
      });
      
      return mergedData;
    }, [metric, child.gender, childsGrowthData]);

    return (
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <LineChart
            accessibilityLayer
            data={combinedChartData}
            margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
            >
            <defs>
              <linearGradient id="growthGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--accent)" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="age" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value}m`} name="Age in Months" />
            <YAxis 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8} 
                name={metric === 'height' ? 'Length/Height (cm)' : 'Weight (kg)'}
                unit={metric === 'height' ? 'cm' : 'kg'}
                domain={metric === 'height' ? [45, 125] : ['auto', 'auto']}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line dataKey="line_minus_3" type="linear" stroke="var(--color-line_minus_3)" strokeWidth={2} dot={false} name="-3 line" />
            <Line dataKey="line_minus_2" type="linear" stroke="var(--color-line_minus_2)" strokeWidth={2} dot={false} name="-2 line" />
            <Line dataKey="line_0" type="linear" stroke="var(--color-line_0)" strokeWidth={3} dot={false} name="0-line (median)" />
            <Line dataKey="line_plus_2" type="linear" stroke="var(--color-line_plus_2)" strokeWidth={2} dot={false} name="+2 line" />
            <Line dataKey="line_plus_3" type="linear" stroke="var(--color-line_plus_3)" strokeWidth={2} dot={false} name="+3 line" />
            <Line dataKey="childData" type="monotone" stroke="url(#growthGradient)" strokeWidth={3} dot={{ r: 5, fill: "var(--card)", stroke: "url(#growthGradient)", strokeWidth: 2 }} activeDot={{ r: 7, fill: "var(--card)", stroke: "url(#growthGradient)", strokeWidth: 2 }} name={child.name} connectNulls />
            </LineChart>
        </ChartContainer>
    );
  };

  const GrowthListView = () => (
    <>
      {child.growthRecords && child.growthRecords.length > 0 ? (
        <ul className="space-y-3">
          {child.growthRecords.map((record, index) => (
            <li key={index} className="flex items-start justify-between gap-4 p-3 bg-muted/50 rounded-md border">
              <div className="flex-1">
                <p className="font-semibold text-foreground">{formatDateStandard(record.date)}</p>
                <p className="text-sm text-muted-foreground">{record.notes || 'Routine check-up'}</p>
              </div>
              <div className="text-right text-sm shrink-0">
                {record.data.height && <p><span className="font-medium text-muted-foreground">H: </span>{record.data.height}</p>}
                {record.data.weight && <p><span className="font-medium text-muted-foreground">W: </span>{record.data.weight}</p>}
                {record.data.headCircumference && <p className="text-xs"><span className="font-medium text-muted-foreground">HC: </span>{record.data.headCircumference}</p>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">No growth records available.</p>
      )}
    </>
  );


  const GenderIcon = child.gender === 'male' ? Mars : Venus;
  const genderColor = child.gender === 'male' ? 'text-blue-500' : 'text-pink-500';

  return (
    <>
      <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      <GrowthRecordFormModal
        open={isGrowthModalOpen}
        onOpenChange={setIsGrowthModalOpen}
        childrenList={[child] as ChildDetail[]}
        initialChildId={child.id}
        onFormSubmit={handleGrowthFormSubmit}
      />
      <div className="container mx-auto py-6">
        <div className="mb-6">
          {currentUserRole && (
            <Button variant="outline" asChild>
              <Link href={backLink}>
                <ArrowLeft className="mr-2 h-4 w-4" /> {backText}
              </Link>
            </Button>
          )}
        </div>

        <Card ref={profileCardRef} className="shadow-xl overflow-hidden">
          <CardHeader className="bg-muted/30 p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 relative">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-md shrink-0">
                <AvatarImage src={child.avatar} alt={child.name} data-ai-hint={child.aiHint}/>
                <AvatarFallback className="text-4xl" name={child.name}>{child.firstName?.[0]}{child.lastName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div className="flex-1">
                    <CardTitle className="font-headline text-3xl md:text-4xl">{child.name}</CardTitle>
                    <CardDescription className="text-lg mt-1">
                      {child.age} old
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 self-start absolute top-0 right-0 sm:static">
                    <Badge variant={getStatusBadgeVariant(child.status)} className="text-sm px-3 py-1">{child.status}</Badge>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Child Actions</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleExportPdf} disabled={isExporting}>
                                <FileDown className="mr-2 h-4 w-4" />
                                <span>{isExporting ? 'Exporting...' : 'Export to PDF'}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/dashboard/children/${child.id}/edit`}>
                                    <Edit3 className="mr-2 h-4 w-4" />
                                    <span>Edit Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete Profile</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-muted-foreground">
                    <div className="flex items-center text-md">
                        <Cake className="h-5 w-5 mr-2 text-pink-500" />
                        <span className="font-medium mr-1 text-foreground">Born:</span> {formatDateStandard(child.dateOfBirth)}
                    </div>
                    <div className="flex items-center text-md">
                        <GenderIcon className={`h-5 w-5 mr-2 ${genderColor}`} />
                        <span className="font-medium mr-1 text-foreground">Gender:</span> <span className="capitalize">{child.gender}</span>
                    </div>
                    {parent && (
                    <div className="flex items-center text-md">
                        <User className="h-5 w-5 mr-2 text-primary" />
                        <span className="font-medium mr-1 text-foreground">Parent:</span>
                        <button onClick={() => setSelectedUser(parent)} className="hover:underline">
                             {parent.name}
                        </button>
                    </div>
                    )}
                    {clinician && (
                    <div className="flex items-center text-md">
                        <Stethoscope className="h-5 w-5 mr-2 text-primary" />
                        <span className="font-medium mr-1 text-foreground">Clinician:</span>
                        <button onClick={() => setSelectedUser(clinician)} className="hover:underline">
                           {(clinician.title || '') + ' ' + clinician.name}
                        </button>
                    </div>
                    )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-8">
              <div className="border rounded-lg">
                  <button
                  onClick={() => setIsDetailsCollapsed(!isDetailsCollapsed)}
                  className="w-full flex justify-between items-center p-4 hover:bg-muted/50 rounded-lg transition-colors"
                  aria-expanded={!isDetailsCollapsed}
                  aria-controls="additional-details-content"
                  >
                  <h3 className="text-xl font-semibold">Additional Details</h3>
                  <div className="flex items-center gap-2 text-primary">
                      <span>{isDetailsCollapsed ? 'Show More' : 'Show Less'}</span>
                      <ChevronDown className={cn("h-5 w-5 transition-transform duration-300", !isDetailsCollapsed && "rotate-180")} />
                  </div>
                  </button>
                  {(isExporting || !isDetailsCollapsed) && (
                      <div id="additional-details-content" className="p-6 border-t grid gap-8 md:grid-cols-3">
                          <div className="md:col-span-2 space-y-6">
                              <section>
                                  <h3 className="text-lg font-semibold mb-3 flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" />Notes & Observations</h3>
                                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed bg-background p-4 rounded-md border">
                                      {child.notes || "No notes available for this child."}
                                  </p>
                              </section>
                              <Separator />
                              <section>
                                  <h3 className="text-lg font-semibold mb-3 flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-primary" />Development Progress</h3>
                                  <div className="space-y-4">
                                      <div>
                                          <div className="flex justify-between mb-1">
                                              <span className="text-sm font-medium text-muted-foreground">Communication Skills</span>
                                              <span className="text-sm font-medium text-primary">{child.progress}%</span>
                                          </div>
                                          <Progress value={child.progress} aria-label="Communication Skills Progress" className="h-3" />
                                      </div>
                                      <div>
                                          <div className="flex justify-between mb-1">
                                              <span className="text-sm font-medium text-muted-foreground">Motor Skills</span>
                                              <span className="text-sm font-medium text-primary">{child.progress - 15 > 0 ? child.progress - 15 : 10}%</span>
                                          </div>
                                          <Progress value={child.progress - 15 > 0 ? child.progress - 15 : 10} aria-label="Motor Skills Progress" className="h-3" />
                                      </div>
                                      <div>
                                          <div className="flex justify-between mb-1">
                                              <span className="text-sm font-medium text-muted-foreground">Social Interaction</span>
                                              <span className="text-sm font-medium text-primary">{child.progress + 10 < 100 ? child.progress + 10 : 95}%</span>
                                          </div>
                                          <Progress value={child.progress + 10 < 100 ? child.progress + 10 : 95} aria-label="Social Interaction Progress" className="h-3" />
                                      </div>
                                  </div>
                              </section>
                          </div>
                          <div className="space-y-6 md:border-l md:pl-8">
                              <section>
                                  <h3 className="text-xl font-semibold mb-3 flex items-center"><User className="mr-2 h-5 w-5 text-primary" />Assigned Clinicians</h3>
                                  {clinician ? (
                                      <button onClick={() => setSelectedUser(clinician)} className="w-full flex items-center space-x-3 bg-background p-3 rounded-md border group hover:bg-muted/50 transition-colors">
                                        <RoleAvatar
                                          src={clinician.avatarUrl}
                                          name={clinician.name}
                                          role={clinician.role}
                                          aiHint="doctor portrait"
                                          avatarClassName="h-10 w-10"
                                          iconContainerClassName="h-5 w-5 border-2"
                                          iconClassName="h-3 w-3"
                                        />
                                        <div>
                                          <p className="font-medium text-left">{(clinician.title || '') + ' ' + clinician.name}</p>
                                          <p className="text-xs text-muted-foreground">Pediatric Therapist</p>
                                        </div>
                                      </button>
                                  ) : (
                                      <p className="text-muted-foreground">No clinician assigned.</p>
                                  )}
                                  <Button variant="outline" size="sm" className="mt-3 w-full">
                                      <PlusCircle className="mr-2 h-4 w-4" /> Assign Clinician
                                  </Button>
                              </section>
                              <Separator />
                              <section>
                                  <h3 className="text-xl font-semibold mb-3">Recent Activity</h3>
                                  <ul className="space-y-2 text-sm text-muted-foreground">
                                      <li className="flex items-center"><Badge variant="outline" className="mr-2">Note Added</Badge> Profile updated by Parent - {child.lastUpdate ? formatDateStandard(child.lastUpdate) : 'N/A'}</li>
                                      <li className="flex items-center"><Badge variant="outline" className="mr-2">Milestone</Badge> Achieved 'First Words' - 2024-06-10</li>
                                      {clinician && <li className="flex items-center"><Badge variant="outline" className="mr-2">Session</Badge> Attended therapy with {(clinician.title || '') + ' ' + clinician.name} - 2024-07-15</li>}
                                  </ul>
                              </section>
                          </div>
                      </div>
                  )}
              </div>

            {/* New Records Section */}
            <section className="pt-6 border-t">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <ClipboardList className="mr-2 h-5 w-5 text-primary" />
                Child Records
              </h3>
              <Tabs value={activeTab} onValueChange={(value) => updateUrlParams({ recordType: value })} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="growth" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <TrendingUp className="mr-2 h-4 w-4" />Growth
                  </TabsTrigger>
                  <TabsTrigger value="milestones" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Award className="mr-2 h-4 w-4" />Milestones
                  </TabsTrigger>
                  <TabsTrigger value="vaccinations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <ShieldPlus className="mr-2 h-4 w-4" />Vaccinations
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="growth">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                          <CardTitle>Growth Records</CardTitle>
                          <CardDescription>
                              {isExporting ? `Full growth report for ${child.name}`
                                : growthView === 'chart' 
                                  ? `Displaying ${chartMetric}-for-age chart for ${child.gender === 'male' ? 'boys' : 'girls'}`
                                  : `List of all growth records for ${child.name}`
                              }
                          </CardDescription>
                      </div>
                      {!isExporting && (
                          <div className="flex items-center gap-2">
                          <Button variant={growthView === 'list' ? 'default' : 'outline'} size="icon" onClick={() => updateUrlParams({ growthView: 'list' })}>
                              <List className="h-4 w-4" />
                              <span className="sr-only">List view</span>
                          </Button>
                          <Button variant={growthView === 'chart' ? 'default' : 'outline'} size="icon" onClick={() => updateUrlParams({ growthView: 'chart' })}>
                              <BarChart2 className="h-4 w-4" />
                              <span className="sr-only">Chart view</span>
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => setIsGrowthModalOpen(true)}>
                              <PlusCircle className="h-4 w-4" />
                              <span className="sr-only">Add record</span>
                          </Button>
                          </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      {isExporting ? (
                         <div className="space-y-8">
                          <div>
                            <h4 className="text-lg font-semibold mb-2">Growth Records List</h4>
                            <GrowthListView />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold mb-2">Weight-for-Age Chart</h4>
                             <GrowthChart metric="weight" child={child} />
                          </div>
                           <div>
                            <h4 className="text-lg font-semibold mb-2">Height-for-Age Chart</h4>
                             <GrowthChart metric="height" child={child} />
                          </div>
                        </div>
                      ) : growthView === 'list' ? (
                         <GrowthListView />
                      ) : (
                         <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                  <Button variant={chartMetric === 'weight' ? 'default' : 'outline'} size="sm" onClick={() => updateUrlParams({ chartMetric: 'weight' })}>
                                  Weight-for-age
                                  </Button>
                                  <Button variant={chartMetric === 'height' ? 'default' : 'outline'} size="sm" onClick={() => updateUrlParams({ chartMetric: 'height' })}>
                                  Height-for-age
                                  </Button>
                              </div>
                              <GrowthChart metric={chartMetric as 'weight' | 'height'} child={child} />
                          </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="milestones">
                  <Card>
                    <CardHeader><CardTitle>Developmental Milestones Checklist</CardTitle></CardHeader>
                    <CardContent>
                      <Accordion 
                          type="multiple" 
                          className="w-full"
                          value={openAccordionItems}
                          onValueChange={isExporting ? undefined : setOpenAccordionItems}
                      >
                        {standardMilestonesByAge.map((ageGroup) => (
                          <AccordionItem value={ageGroup.age} key={ageGroup.age}>
                            <AccordionTrigger className="text-lg font-semibold">{ageGroup.age} Milestones</AccordionTrigger>
                            <AccordionContent>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-[100px]">Status</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Milestone</TableHead>
                                    <TableHead className="text-right">Date Achieved</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {ageGroup.milestones.map((milestone) => {
                                    const completedMilestone = child.completedMilestones?.find(
                                      (cm) => cm.milestoneId === milestone.id
                                    );
                                    const isCompleted = !!completedMilestone;
                                    return (
                                      <TableRow key={milestone.id}>
                                        <TableCell>
                                          <Checkbox
                                            id={`milestone-${milestone.id}`}
                                            checked={isCompleted}
                                            disabled
                                            aria-label={`${milestone.description} ${isCompleted ? 'completed' : 'pending'}`}
                                          />
                                        </TableCell>
                                        <TableCell>{milestone.category}</TableCell>
                                        <TableCell className="font-medium">{milestone.description}</TableCell>
                                        <TableCell className="text-right">
                                          {isCompleted && completedMilestone.dateAchieved
                                            ? formatDateStandard(completedMilestone.dateAchieved)
                                            : 'Pending'}
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="vaccinations">
                  <Card>
                    <CardHeader><CardTitle>Vaccination Schedule & Status</CardTitle></CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Status</TableHead>
                            <TableHead>Vaccine</TableHead>
                            <TableHead>Dose</TableHead>
                            <TableHead>Recommended Age</TableHead>
                            <TableHead>Date Administered</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {standardVaccinationSchedule.map((vaccine) => {
                            const completedVaccine = child.completedVaccinations?.find(cv => cv.vaccineId === vaccine.id);
                            const isCompleted = !!completedVaccine;
                            return (
                              <TableRow key={vaccine.id}>
                                <TableCell>
                                  <Checkbox
                                    id={`vaccine-${vaccine.id}`}
                                    checked={isCompleted}
                                    disabled 
                                    aria-label={`${vaccine.name} ${isCompleted ? 'completed' : 'pending'}`}
                                  />
                                </TableCell>
                                <TableCell className="font-medium">{vaccine.name}</TableCell>
                                <TableCell>{vaccine.doseInfo}</TableCell>
                                <TableCell>{vaccine.recommendedAge}</TableCell>
                                <TableCell>
                                  {isCompleted && completedVaccine.dateAdministered 
                                    ? formatDateStandard(completedVaccine.dateAdministered) 
                                    : 'Pending'}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </section>
          </CardContent>
          <CardFooter className="bg-muted/30 p-6 border-t">
            <p className="text-xs text-muted-foreground">
              Profile last updated: {child.lastUpdate ? formatDatePretty(child.lastUpdate) : 'N/A'}
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
