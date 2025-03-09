// This is a mock API route for local development and fallback
// In production, these requests would go to your Rails backend

export async function GET() {
  try {
    // Try to fetch from the actual backend first
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    console.log("API URL from env:", apiUrl)

    if (apiUrl) {
      try {
        const response = await fetch(`${apiUrl}/api/messages`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          cache: "no-store",
        })

        if (response.ok) {
          const data = await response.json()
          return new Response(JSON.stringify(data), {
            headers: { "Content-Type": "application/json" },
          })
        }

        // If the backend request fails, fall back to mock data
        console.log("Backend request failed, using mock data")
      } catch (error) {
        console.error("Error fetching from backend:", error)
        // Continue to mock data
      }
    }

    // Return mock data as fallback
    return new Response(
      JSON.stringify([
        {
          id: 1,
          content: "Welcome to the chat app!",
          username: "System",
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          content: "This is a mock message since we couldn't connect to the backend.",
          username: "System",
          created_at: new Date().toISOString(),
        },
        {
          id: 3,
          content: "You can still test the UI while we work on connecting to the backend.",
          username: "System",
          created_at: new Date().toISOString(),
        },
      ]),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error in API route:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch messages" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Try to send to the actual backend first
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    if (apiUrl) {
      try {
        const response = await fetch(`${apiUrl}/api/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(body),
        })

        if (response.ok) {
          const data = await response.json()
          return new Response(JSON.stringify(data), {
            headers: { "Content-Type": "application/json" },
          })
        }

        // If the backend request fails, fall back to mock response
        console.log("Backend POST request failed, using mock response")
      } catch (error) {
        console.error("Error posting to backend:", error)
        // Continue to mock response
      }
    }

    // Return mock response as fallback
    return new Response(
      JSON.stringify({
        id: Date.now(),
        content: body.message.content,
        username: body.message.username,
        created_at: new Date().toISOString(),
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error in POST API route:", error)
    return new Response(JSON.stringify({ error: "Failed to create message" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

