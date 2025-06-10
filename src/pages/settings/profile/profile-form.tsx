import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useFieldArray, useForm } from 'react-hook-form'
import { Button } from '@/components/custom/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email(),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: 'Please enter a valid URL.' }),
      })
    )
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// Fetch userEmail from localStorage
const storedEmail = localStorage.getItem('userEmail') ?? 'm@example.com'

const defaultValues: Partial<ProfileFormValues> = {
  username: 'Admin',
  email: storedEmail,
  bio: "Passionate about building user-friendly apps and delivering quality code. Always eager to learn and innovate.",
  urls: [
    { value: 'https://github.com/pms' },
    { value: 'https://pms.com/' },
  ],
}

export default function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  // If localStorage email changes during component lifetime, update the form email value
  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (email) {
      form.setValue('email', email)
    }
  }, [form])

  const { fields} = useFieldArray({
    name: 'urls',
    control: form.control,
  })

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        {/* Username - readonly */}
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} readOnly />
              </FormControl>
              <FormDescription>
                This is your default display name provided by the system. It may be your official ID or a system-generated username.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email - select, default from localStorage */}
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a verified email to display' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* <SelectItem value='m@example.com'>m@example.com</SelectItem>
                  <SelectItem value='m@google.com'>m@google.com</SelectItem>
                  <SelectItem value='m@support.com'>m@support.com</SelectItem> */}
                  {/* Also allow the stored email if not in the list */}
                  {storedEmail &&
                    !['m@example.com', 'm@google.com', 'm@support.com'].includes(storedEmail) && (
                      <SelectItem value={storedEmail}>{storedEmail}</SelectItem>
                    )}
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage verified email addresses in your{' '}
                <Link to='/examples/forms'>server settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bio */}
        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Tell us a little bit about yourself'
                  className='resize-none'
                  {...field} readOnly
                />
              </FormControl>
              <FormDescription>
                Share a bit about your background, passions, or what you do.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* URLs */}
        <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && 'sr-only')}>
                    URLs
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && 'sr-only')}>
                    Our links to website, blog, or social media profiles.
                  </FormDescription>
                  <FormControl>
                    <Input {...field}  readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          {/* <Button
            type='button'
            variant='outline'
            size='sm'
            className='mt-2'
            onClick={() => append({ value: '' })}
          >
            Add URL
          </Button> */}
        </div>

        <Button type='submit'>Update profile</Button>
      </form>
    </Form>
  )
}
