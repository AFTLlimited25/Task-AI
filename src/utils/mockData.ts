import { Task, Notification, User, RelatedEmail, RelatedEvent } from '../types';

// Mock user
export const mockUser: User = {
  id: '1',
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=256',
  isConnected: {
    gmail: false,
    calendar: false
  }
};

// Mock related emails
const mockEmails: RelatedEmail[] = [
  {
    id: 'e1',
    subject: 'Your Netflix Subscription',
    sender: 'info@netflix.com',
    receivedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    snippet: 'Your monthly subscription will renew on June 15th. Click here to review your plan',
    isRead: true
  },
  {
    id: 'e2',
    subject: 'Appointment Confirmation - Dr. Wilson',
    sender: 'appointments@cityhealth.com',
    receivedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    snippet: 'This email confirms your appointment with Dr. Wilson on June 20th at 2:30 PM',
    isRead: true
  },
  {
    id: 'e3',
    subject: 'Flight Cancellation Refund Status',
    sender: 'support@airline.com',
    receivedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    snippet: 'We are processing your refund for flight AB123. Estimated processing time is 5-7 business days',
    isRead: false
  }
];

// Mock related events
const mockEvents: RelatedEvent[] = [
  {
    id: 'ev1',
    title: 'Dentist Appointment',
    startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    location: 'Smile Dental Clinic, 123 Main St',
    attendees: ['Dr. Johnson', 'Jane Smith']
  }
];

// Mock tasks
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Cancel Netflix Subscription',
    description: 'Need to cancel Netflix subscription before the next billing cycle on June 15th to avoid being charged.',
    type: 'subscription',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    relatedEmails: [mockEmails[0]],
    actions: [
      {
        id: 'a1',
        taskId: '1',
        type: 'send_email',
        status: 'pending',
        details: {
          recipient: 'support@netflix.com',
          subject: 'Cancel Subscription',
          body: 'I would like to cancel my subscription effective immediately.'
        }
      },
      {
        id: 'a2',
        taskId: '1',
        type: 'check_status',
        status: 'pending',
        scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        details: {
          checkType: 'subscription_status'
        }
      }
    ]
  },
  {
    id: '2',
    title: 'Confirm Doctor Appointment',
    description: 'Call the clinic to confirm my appointment with Dr. Wilson and ask about parking options.',
    type: 'appointment',
    status: 'pending',
    priority: 'high',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    relatedEmails: [mockEmails[1]],
    actions: [
      {
        id: 'a3',
        taskId: '2',
        type: 'make_call',
        status: 'pending',
        details: {
          phoneNumber: '555-123-4567',
          notes: 'Ask about parking options and confirm appointment time'
        }
      }
    ]
  },
  {
    id: '3',
    title: 'Follow up on Flight Refund',
    description: 'Need to check the status of my refund for the canceled flight AB123 that was supposed to be processed within 7 business days.',
    type: 'refund',
    status: 'in_progress',
    priority: 'medium',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    relatedEmails: [mockEmails[2]],
    actions: [
      {
        id: 'a4',
        taskId: '3',
        type: 'send_email',
        status: 'completed',
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        details: {
          recipient: 'support@airline.com',
          subject: 'Refund Status Inquiry - Flight AB123',
          body: 'I am writing to inquire about the status of my refund for flight AB123 that was canceled.'
        }
      },
      {
        id: 'a5',
        taskId: '3',
        type: 'check_status',
        status: 'pending',
        scheduledFor: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        details: {
          checkType: 'refund_status'
        }
      }
    ]
  },
  {
    id: '4',
    title: 'Schedule Dentist Appointment',
    description: 'Need to schedule my bi-annual dental cleaning and checkup.',
    type: 'appointment',
    status: 'completed',
    priority: 'low',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    relatedEvents: [mockEvents[0]],
    actions: [
      {
        id: 'a6',
        taskId: '4',
        type: 'schedule_event',
        status: 'completed',
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        details: {
          title: 'Dentist Appointment',
          start: mockEvents[0].startTime,
          end: mockEvents[0].endTime,
          location: mockEvents[0].location
        }
      }
    ]
  },
  {
    id: '5',
    title: 'Remind Sam about Lunch Next Week',
    description: 'Need to follow up with Sam about our lunch plans next week on Thursday.',
    type: 'reminder',
    status: 'waiting_response',
    priority: 'low',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    actions: [
      {
        id: 'a7',
        taskId: '5',
        type: 'send_email',
        status: 'completed',
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        details: {
          recipient: 'sam@example.com',
          subject: 'Lunch Next Thursday?',
          body: 'Just checking in about our lunch plans for next Thursday. Are we still on for noon?'
        }
      },
      {
        id: 'a8',
        taskId: '5',
        type: 'check_status',
        status: 'pending',
        scheduledFor: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        details: {
          checkType: 'email_response'
        }
      }
    ]
  },
  {
    id: '6',
    title: 'Pay Water Bill',
    description: 'The water bill is due by the end of the month. Need to pay it online.',
    type: 'reminder',
    status: 'pending',
    priority: 'high',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    actions: [
      {
        id: 'a9',
        taskId: '6',
        type: 'custom',
        status: 'pending',
        scheduledFor: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        details: {
          actionType: 'payment',
          paymentUrl: 'https://water.cityutilities.com',
          amount: '$42.50'
        }
      }
    ]
  }
];

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'success',
    message: 'Successfully scheduled dentist appointment',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    relatedTaskId: '4'
  },
  {
    id: 'n2',
    type: 'info',
    message: 'Email sent to airline support about refund',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    relatedTaskId: '3'
  },
  {
    id: 'n3',
    type: 'warning',
    message: 'Netflix subscription renews in 5 days',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    relatedTaskId: '1'
  }
];