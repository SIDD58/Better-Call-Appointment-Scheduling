## Appointment Booking 

## Demo

Frontend: https://better-call-appointment-scheduling.vercel.app/
Local Edge Function (GitHub): https://github.com/SIDD58/Better-Call-Appointment-backend 

## Tech Stack

Frontend : React, HTML, CSS , supabase client library
Frontend Deployment : Vercel
Serverless Function: Deno (JS Runtime), Supabase Edge Function , Supabase DATA API
Messaging API : Meta Cloud API 


## Workflow:
1. Create an appointment
2. Record is stored in Supabase Database (RLS is enabled and policy is set)
3. When a new record is inserted Supabase Database Webhook is triggered
4. Supabase Edge Function executes which Calls Meta Cloud API to send message on user's WhatsApp
5. Meta Cloud API sends the message to user's WhatsApp
6. Secret Environment variables are stored in Supabasse and Vercel Environment 

## Contraints 
1. Temporary meta cloud API Token (Free) is being used , It refreshes after some hours , that has to be manually updated in Serverless edge function for now, unless we change it to permanent Cloud API token
2. In free plan you can register upto 5 phone number by OTP verification , right now I am using one of my WhatsApp number for verification
3. User initiated messages are used as for template message to get approved by meta cloud API , It takes sometime.

## FrontEnd Design 
1. Appointment Form : To input customer name , phone number and appointment date and time
2. Appointment Dashbaord: Dashboard to show the Current Appointments 