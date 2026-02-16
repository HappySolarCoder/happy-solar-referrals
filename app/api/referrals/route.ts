import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for MVP (will persist during function lifetime)
// For production, this should be replaced with a database
let referrals: any[] = [];

// GET - Fetch all referrals (for admin dashboard)
export async function GET() {
  try {
    return NextResponse.json(referrals);
  } catch (error) {
    console.error('Error reading referrals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referrals' },
      { status: 500 }
    );
  }
}

// POST - Submit a new referral
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { referrerName, referrerEmail, leadName, leadAddress, leadPhone } = body;
    
    if (!referrerName || !referrerEmail || !leadName || !leadAddress || !leadPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create referral object
    const referral = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      referrerName,
      referrerEmail,
      leadName,
      leadAddress,
      leadPhone,
      leadEmail: body.leadEmail || '',
      leadNotes: body.leadNotes || '',
      status: 'submitted',
      assignedSetter: '',
      incentiveAmount: 500,
      incentiveStatus: 'pending',
      emailDay0Sent: false,
      emailDay3Sent: false,
      emailDay7Sent: false,
      lastContactDate: null
    };

    // Add to in-memory storage
    referrals.push(referral);

    // TODO: Send confirmation email to referrer
    // TODO: Send Day 0 email to referred lead
    // TODO: Save to persistent database (Vercel Postgres, Supabase, etc.)
    
    return NextResponse.json(referral, { status: 201 });
  } catch (error) {
    console.error('Error creating referral:', error);
    return NextResponse.json(
      { error: 'Failed to create referral' },
      { status: 500 }
    );
  }
}

// PATCH - Update referral status (for admin dashboard)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Referral ID required' },
        { status: 400 }
      );
    }

    // Find and update referral
    const index = referrals.findIndex((r: any) => r.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Referral not found' },
        { status: 404 }
      );
    }

    referrals[index] = {
      ...referrals[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(referrals[index]);
  } catch (error) {
    console.error('Error updating referral:', error);
    return NextResponse.json(
      { error: 'Failed to update referral' },
      { status: 500 }
    );
  }
}
