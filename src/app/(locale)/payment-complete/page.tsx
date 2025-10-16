"use client"
import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  // const orderShort = sessionId && sessionId.length > 8 ? sessionId.slice(-8).toUpperCase() : sessionId

  return (
    <section aria-labelledby="thank-you-heading" className="w-full text-center h-screen flex flex-col items-center justify-center">
      <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
        {/* decorative check icon */}
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" focusable="false">
          <path
            d="M20 7L9 18l-5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h1 id="thank-you-heading" className="text-pretty text-3xl font-semibold tracking-tight md:text-4xl">
        Payment successful
      </h1>
      <p className="mt-2 text-sm text-muted-foreground md:text-base">
        Thank you for your purchase. Your order has been confirmed and a receipt will be emailed to you shortly.
      </p>

      {/* <Card className="mx-auto mt-6 text-left">
        <CardHeader>
          <CardTitle className="text-balance text-xl">Order summary</CardTitle>
          <CardDescription>Keep these details for your records.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {orderShort ? (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Order number</span>
              <span className="font-medium">{orderShort}</span>
            </div>
          ) : null}

          {email ? (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{email}</span>
            </div>
          ) : null}

          {!orderShort && !email ? (
            <p className="text-sm text-muted-foreground">No additional details were provided.</p>
          ) : null}
        </CardContent>
      </Card> */}

      <div className="mx-auto mt-8 flex w-full max-w-sm items-center justify-center gap-3">
        <Button className="w-full" onClick={() => window.close()}>
          Continue
        </Button>
      </div>
    </section>
  )
}
