import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Data file path (storing in project root for MVP)
const DATA_FILE = path.join(process.cwd(), 'referrals.json');

// Initialize data file if it doesn't exist
async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
  }
}

// Read referrals from file
async function readReferrals() {
  await ensureDataFile();
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

// Write referrals to file
async function writeReferrals(referrals: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(referrals, null, 2));
}

// GET - Fetch all referrals (for admin dashboard)
export async function GET() {
  try {
    const referrals = await readReferrals();
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

    // Read existing referrals
    const referrals = await readReferrals();
    
    // Add new referral
    referrals.push(referral);
    
    // Write back to file
    await writeReferrals(referrals);

    // TODO: Send confirmation email to referrer
    // TODO: Send Day 0 email to referred lead
    
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

    // Read existing referrals
    const referrals = await readReferrals();
    
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
    
    // Write back to file
    await writeReferrals(referrals);
    
    return NextResponse.json(referrals[index]);
  } catch (error) {
    console.error('Error updating referral:', error);
    return NextResponse.json(
      { error: 'Failed to update referral' },
      { status: 500 }
    );
  }
}
