import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RecaptchaRequest {
  token: string;
  action: string;
}

interface RecaptchaResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { token, action }: RecaptchaRequest = await req.json()

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the reCAPTCHA secret key from environment
    const secretKey = Deno.env.get('RECAPTCHA_SECRET_KEY')
    
    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY not found in environment variables')
      return new Response(
        JSON.stringify({ error: 'reCAPTCHA not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verify the token with Google reCAPTCHA v3
    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify'
    const verifyParams = new URLSearchParams({
      secret: secretKey,
      response: token
    })

    const verifyResponse = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: verifyParams
    })

    const verifyResult: RecaptchaResponse = await verifyResponse.json()

    console.log('reCAPTCHA verification result:', verifyResult)

    if (!verifyResult.success) {
      return new Response(
        JSON.stringify({ 
          error: 'reCAPTCHA verification failed',
          details: verifyResult['error-codes'] 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check score (for v3, score should be > 0.5 for legitimate users)
    const score = verifyResult.score || 0
    const isValid = score >= 0.5

    // Check if action matches (if provided)
    const actionValid = !action || verifyResult.action === action

    if (!isValid || !actionValid) {
      return new Response(
        JSON.stringify({ 
          error: 'reCAPTCHA verification failed',
          score,
          action: verifyResult.action,
          expected_action: action
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        score,
        action: verifyResult.action
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})