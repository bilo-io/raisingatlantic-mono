
"use client";

import { UserCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cliniciansToVerify } from '@/data/verifications';
import { formatDateStandard } from '@/utils/date';
import { RoleAvatar } from '@/components/ui/RoleAvatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function ClinicianVerificationsPage() {
  // In a real app, you'd fetch and manage state for clinicians
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6">
         <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <UserCheck className="mr-3 h-7 w-7 text-primary" />
                  <h1 className="font-headline text-2xl font-bold tracking-tight">Clinician Verifications</h1>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Verify new clinician applications.</p>
              </TooltipContent>
            </Tooltip>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search clinicians..."
              className="pl-8 w-full sm:w-[300px]"
              // value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Placeholder for potential actions */}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Pending Clinician Verifications</CardTitle>
            <CardDescription>Review and approve or request more information for new clinician applications.</CardDescription>
          </CardHeader>
          <CardContent>
            {cliniciansToVerify.length > 0 ? (
              <ul className="space-y-4">
                {cliniciansToVerify.map((clinician) => (
                  <li key={clinician.id} className="p-4 border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                       <RoleAvatar
                          src={clinician.avatar}
                          name={clinician.name}
                          role={clinician.role}
                          aiHint={clinician.aiHint}
                          avatarClassName="h-10 w-10"
                          iconContainerClassName="h-5 w-5 border-2"
                          iconClassName="h-3 w-3"
                        />
                      <div>
                        <p className="font-semibold">{(clinician.title || '') + ' ' + clinician.name}</p>
                        <p className="text-sm text-muted-foreground">{clinician.specialty}</p>
                        <p className="text-xs text-muted-foreground">Submitted: {formatDateStandard(clinician.submissionDate)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                       <span className={`text-xs font-medium px-2 py-1 rounded-full ${clinician.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-orange-100 text-orange-800'}`}>
                          {clinician.status}
                       </span>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">View Application</Button>
                      <Button size="sm" className="w-full sm:w-auto">Approve</Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-8">No clinicians currently pending verification.</p>
            )}
          </CardContent>
        </Card>
        {/* Add more sections for approved/rejected clinicians if needed */}
      </div>
    </TooltipProvider>
  );
}
