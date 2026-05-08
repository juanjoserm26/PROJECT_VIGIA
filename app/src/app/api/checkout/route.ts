import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plan, email, card } = body;

    // Validate input
    if (!plan || !email || !card) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Simulate payment processing
    // In a real application, you would integrate with Stripe, PayPal, etc.
    const transactionId = `VIGIA-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Simulate a small delay for payment processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 95% success rate for demo purposes
    if (Math.random() > 0.05) {
      return NextResponse.json({
        success: true,
        transactionId,
        message: 'Payment processed successfully',
        plan,
        email,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment declined. Please try again with a different card.',
        },
        { status: 402 }
      );
    }
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
