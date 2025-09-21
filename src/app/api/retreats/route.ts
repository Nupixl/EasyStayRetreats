import { NextRequest, NextResponse } from 'next/server';

// Configure for Webflow Cloud Edge runtime
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const retreats = [
    {
      id: 1,
      title: "Mountain Zen Retreat",
      location: "Swiss Alps, Switzerland",
      duration: "7 days",
      price: "$2,499",
      description: "Find peace in the majestic Swiss Alps with daily meditation, yoga, and mountain hiking.",
      features: ["Daily meditation sessions", "Mountain yoga", "Organic meals", "Nature hikes"],
      available: true
    },
    {
      id: 2,
      title: "Coastal Mindfulness",
      location: "Big Sur, California",
      duration: "5 days",
      price: "$1,899",
      description: "Reconnect with yourself along the stunning California coastline through mindful practices.",
      features: ["Beach meditation", "Ocean yoga", "Fresh seafood", "Sunset sessions"],
      available: true
    },
    {
      id: 3,
      title: "Forest Sanctuary",
      location: "Costa Rica",
      duration: "10 days",
      price: "$3,299",
      description: "Immerse yourself in the healing power of the Costa Rican rainforest.",
      features: ["Jungle meditation", "Wildlife encounters", "Plant-based cuisine", "Waterfall visits"],
      available: false
    }
  ];

  return NextResponse.json({
    success: true,
    data: retreats,
    message: "Retreats retrieved successfully"
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simple validation
    if (!body.name || !body.email || !body.retreatId) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields: name, email, retreatId"
      }, { status: 400 });
    }

    // In a real application, you would save this to a database
    const booking = {
      id: Date.now(),
      name: body.name,
      email: body.email,
      retreatId: body.retreatId,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: booking,
      message: "Booking request received successfully"
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Invalid request body"
    }, { status: 400 });
  }
}
