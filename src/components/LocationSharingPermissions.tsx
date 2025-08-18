
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Shield, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface LocationSharingPermissionsProps {
  jobId: string;
  granteeId: string;
  className?: string;
}

export default function LocationSharingPermissions({ 
  jobId, 
  granteeId,
  className 
}: LocationSharingPermissionsProps) {
  const [enabled, setEnabled] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);

  const handleShareLocationPermission = async () => {
    if (!enabled) return;
    if (!date) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an expiry date for permission",
      });
      return;
    }

    try {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Set expiry time to 11:59 PM on the selected date
      const expiryDate = new Date(date);
      expiryDate.setHours(23, 59, 59, 999);

      // Using any type to bypass type checking issues
      const { error: insertError } = await supabase
        .from('location_permissions')
        .insert({
          grantor_id: userId,
          grantee_id: granteeId,
          job_id: jobId,
          expiry_time: expiryDate.toISOString(),
          status: 'ACTIVE'
        } as any);

      if (insertError) throw new Error(insertError.message);

      toast({
        title: "Permission Granted",
        description: `Location sharing enabled until ${format(expiryDate, 'PPP')}`,
      });
    } catch (error) {
      console.error('Error setting permission:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to set location sharing permission",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-brand-500" />
            <h3 className="font-medium">Location Privacy</h3>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="location-permission" className="text-sm font-medium">
                Share my location
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow access to your real-time location
              </p>
            </div>
            <Switch 
              id="location-permission" 
              checked={enabled} 
              onCheckedChange={setEnabled}
            />
          </div>
          
          <div className={cn(
            "space-y-2",
            !enabled && "opacity-50 pointer-events-none"
          )}>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <Label className="text-sm">Permission expires on</Label>
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select expiry date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <Button 
            onClick={handleShareLocationPermission} 
            className="w-full"
            disabled={!enabled || !date || loading}
          >
            {loading ? "Saving..." : "Update Permissions"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
