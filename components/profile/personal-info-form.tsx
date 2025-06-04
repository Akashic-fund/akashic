'use client';

import { useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// import { countries } from "@/lib/constant"
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUserProfile } from '@/lib/hooks/useProfile';
import { enableFormDefault } from '@/lib/develop';
import { useCrowdsplitUpdateCustomer } from '@/lib/crowdsplit/hooks/useCrowdsplit';
import { useAuth } from '@/contexts';
import { useRouter } from 'next/navigation';
const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  documentType: z.enum(['ITIN', 'SSN']),
  documentNumber: z
    .string()
    .regex(
      /^9\d{8}$/,
      'Document number must be a 9-digit number starting with 9',
    ),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  streetNumber: z.string().min(1, 'Street number is required'),
  streetName: z.string().min(1, 'Street name is required'),
  neighborhood: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  addressCountryId: z.number().min(1, 'Country is required'),
  postalCode: z.string().min(5, 'Postal code must be at least 5 characters'),
  phoneCountryCode: z.string().min(1, 'Country code is required'),
  phoneAreaCode: z.string().min(1, 'Area code is required'),
  phoneNumber: z.string().min(7, 'Phone number must be at least 7 characters'),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  hasCustomer: boolean;
  customerId: string | null;
  onSuccess?: () => void;
}

export function PersonalInfoForm({
  hasCustomer,
  customerId,
  onSuccess,
}: PersonalInfoFormProps) {
  const { authenticated, isReady } = useAuth();
  const { data: profile } = useUserProfile();
  const router = useRouter();
  const { mutateAsync: updateCustomer, isPending } =
    useCrowdsplitUpdateCustomer();
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: profile?.firstName ?? '',
      lastName: profile?.lastName ?? '',
      email: profile?.email ?? '',
      documentType: 'ITIN',
      documentNumber: '',
      dob: '',
      streetNumber: '',
      streetName: '',
      neighborhood: '',
      city: '',
      state: '',
      addressCountryId: 2, // Default to US
      postalCode: '',
      phoneCountryCode: '1', // Default to US
      phoneAreaCode: '',
      phoneNumber: '',
    },
  });
  const onSubmit = useCallback(
    async (data: PersonalInfoFormValues) => {
      if (!authenticated || !isReady) {
        toast({
          title: 'Error',
          description: 'Please connect your wallet first',
          variant: 'destructive',
        });
        return;
      }

      try {
        updateCustomer(data);
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
        router.push('/profile');
      } catch (error) {
        console.error('Error creating customer:', error);
        toast({
          title: 'Error',
          description:
            error instanceof Error
              ? error.message
              : 'Failed to save personal information',
          variant: 'destructive',
        });
      }
    },
    [isReady, authenticated, updateCustomer, onSuccess, router],
  );

  const onDeveloperSubmit = useCallback(async () => {
    if (!enableFormDefault) {
      return;
    }
    await onSubmit({
      firstName: 'John',
      lastName: 'Doh',
      email: 'email@exapmle.com',
      documentType: 'ITIN',
      documentNumber: '999999999',
      dob: '999999999',
      streetNumber: '1',
      streetName: 'street',
      neighborhood: 'neighborhood',
      city: 'city',
      state: 'state',
      addressCountryId: 2, // Default to US
      postalCode: '12345',
      phoneCountryCode: '1', // Default to US
      phoneAreaCode: '2',
      phoneNumber: '7777777',
    });
  }, [onSubmit]);
  return (
    <Card>
      <CardHeader>
        <CardDescription>
          {hasCustomer
            ? 'Your information is verified. You can proceed to KYC verification.'
            : 'Fill in your personal details to create your Crowdsplit customer account.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasCustomer ? (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-600">
              Customer Account Created
            </AlertTitle>
            <AlertDescription className="text-green-600">
              Your customer account has been created successfully. Customer ID:{' '}
              {customerId}
            </AlertDescription>
          </Alert>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          {...field}
                          onDoubleClick={onDeveloperSubmit}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john.doe@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input placeholder="YYYY-MM-DD" {...field} />
                      </FormControl>
                      <FormDescription>Format: YYYY-MM-DD</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ITIN">ITIN</SelectItem>
                          <SelectItem value="SSN">SSN</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="documentNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Number</FormLabel>
                      <FormControl>
                        <Input placeholder="9XXXXXXXX" {...field} />
                      </FormControl>
                      <FormDescription>
                        Must be a 9-digit number starting with 9
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-1 md:col-span-2">
                  <div className="mb-4 text-lg font-medium">
                    Address Information
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="streetNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Number</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="streetName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Main Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Neighborhood</FormLabel>
                      <FormControl>
                        <Input placeholder="Downtown" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="US-CA" {...field} />
                      </FormControl>
                      <FormDescription>
                        Format: US-XX (state code)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="10001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="addressCountryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="2">United States</SelectItem>
                          {/* Add more countries as needed */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-1 md:col-span-2">
                  <div className="mb-4 text-lg font-medium">
                    Phone Information
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="phoneCountryCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country Code</FormLabel>
                      <FormControl>
                        <Input placeholder="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneAreaCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area Code</FormLabel>
                      <FormControl>
                        <Input placeholder="212" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="5551234" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Personal Information'
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
