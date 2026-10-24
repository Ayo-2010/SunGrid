import { z } from 'zod'

const phoneRegex = /^(?:0|\+?234)(?:70|71|80|81|90|91)\d{8}$/

export function normalisePhone(value: string): string {
  const digits = value.replace(/[^\d+]/g, '')
  if (digits.startsWith('+234')) return digits
  if (digits.startsWith('234')) return `+${digits}`
  if (digits.startsWith('0')) return digits
  return digits
}

export const phoneSchema = z
  .string()
  .trim()
  .min(1, 'Enter a phone number')
  .transform(normalisePhone)
  .refine((value) => phoneRegex.test(value), 'Use a valid Nigerian mobile number, e.g. 0803 123 4567')

export const quoteSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name').max(100),
  phone: phoneSchema,
  email: z
    .union([z.literal(''), z.string().trim().email('Enter a valid email address')])
    .optional()
    .default(''),
  customerType: z.string().min(1, 'Select the option that describes you'),
  projectType: z.string().min(1, 'Select a project type'),
  address: z.string().trim().min(6, 'Enter the installation address').max(250),
  state: z.string().min(1, 'Select a state'),
  city: z.string().trim().min(2, 'Enter a city or town').max(100),
  powerSource: z.string().min(1, 'Select your current power source'),
  loadDescription: z
    .string()
    .trim()
    .min(10, 'List the main appliances or loads you want to power')
    .max(2000, 'Please keep this under 2,000 characters'),
  backupHours: z.coerce.number().min(1, 'Enter at least 1 hour').max(72, 'Maximum 72 hours'),
  systemType: z.string().min(1, 'Select a preferred system type'),
  budget: z.string().min(1, 'Select a budget range'),
  timeframe: z.string().min(1, 'Select an installation timeframe'),
  comments: z.string().trim().max(2000).optional().default(''),
  consent: z.literal(true, { message: 'Please confirm you agree to the privacy notice' }),
  website: z.string().max(0, 'Spam detected').optional().default(''),
})

export type QuoteSchema = z.infer<typeof quoteSchema>

export const quoteStepFields: Record<number, (keyof QuoteSchema)[]> = {
  0: ['fullName', 'phone', 'email', 'customerType'],
  1: ['projectType', 'address', 'state', 'city', 'powerSource', 'loadDescription', 'backupHours', 'systemType'],
  2: ['budget', 'timeframe', 'comments'],
  3: ['consent'],
}

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name').max(100),
  phone: phoneSchema,
  email: z
    .union([z.literal(''), z.string().trim().email('Enter a valid email address')])
    .optional()
    .default(''),
  subject: z.string().min(1, 'Select a subject'),
  message: z.string().trim().min(10, 'Tell us a little more').max(2000),
  consent: z.literal(true, { message: 'Please confirm you agree to the privacy notice' }),
  website: z.string().max(0, 'Spam detected').optional().default(''),
})

export const serviceEnquirySchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name').max(100),
  phone: phoneSchema,
  email: z
    .union([z.literal(''), z.string().trim().email('Enter a valid email address')])
    .optional()
    .default(''),
  service: z.string().min(1, 'Select a service'),
  propertyType: z.string().min(1, 'Select a property type'),
  location: z.string().trim().min(2, 'Enter your city or area').max(120),
  details: z.string().trim().min(10, 'Describe the work required').max(1500),
  consent: z.literal(true, { message: 'Please confirm you agree to the privacy notice' }),
  website: z.string().max(0, 'Spam detected').optional().default(''),
})

export type ContactSchema = z.infer<typeof contactSchema>
export type ServiceEnquirySchema = z.infer<typeof serviceEnquirySchema>

export function zodErrors(error: z.ZodError): Record<string, string> {
  const output: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.')
    if (key && !output[key]) output[key] = issue.message
  }
  return output
}

export const fileValidation = {
  maxSizeMb: 8,
  maxFiles: 3,
  accepted: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
}

export function validateFiles(files: File[]): string | null {
  if (files.length > fileValidation.maxFiles) return `Attach a maximum of ${fileValidation.maxFiles} files.`
  for (const file of files) {
    if (file.size > fileValidation.maxSizeMb * 1024 * 1024) {
      return `${file.name} is larger than ${fileValidation.maxSizeMb} MB.`
    }
    if (!fileValidation.accepted.includes(file.type)) {
      return `${file.name} is not a supported file type. Use JPG, PNG, WebP or PDF.`
    }
  }
  return null
}
