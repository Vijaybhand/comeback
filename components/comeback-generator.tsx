"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Flame, Loader2, Sparkles, Copy, Check, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

const responseTypes = ["Witty", "Sarcastic", "Clever", "Silly", "Savage", "Nerdy"]

export function ComebackGenerator() {
  const [input, setInput] = useState("")
  const [responseType, setResponseType] = useState("Witty")
  const [spicyLevel, setSpicyLevel] = useState(5)
  const [comeback, setComeback] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateComeback = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Generate a ${responseType} comeback for: "${input}". The comeback should be ${spicyLevel}/10 on the spiciness scale.`
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response Data:', data);

      if (data.content && data.content[0] && data.content[0].text) {
        setComeback(data.content[0].text);
      } else {
        setComeback("Failed to generate comeback. Please try again.");
      }
    } catch (error) {
      console.error('Error generating comeback:', error);
      setComeback("Failed to generate comeback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(comeback)
    setCopied(true)
    toast({
      title: "Copied!",
      description: "The comeback has been copied to your clipboard.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let animationFrameId: number

    const particleCount = 50 + Math.floor(spicyLevel * 15) // Increase particle count with spicy level
    const particles: { x: number; y: number; radius: number; color: string; vx: number; vy: number }[] = []

    for (let i = 0; i < particleCount; i++) {
      const hue = spicyLevel === 0 ? 120 : 120 - (spicyLevel * 12) // Green (120) to Red (0)
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: `hsla(${hue}, 100%, 50%, ${Math.random() * 0.5 + 0.5})`,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.x += particle.vx * (spicyLevel / 5 + 0.2)
        particle.y += particle.vy * (spicyLevel / 5 + 0.2)

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [spicyLevel])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10"
      >
        <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-lg shadow-2xl">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
              comeback.wiki <Sparkles className="inline-block ml-2 text-yellow-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="input" className="text-lg font-semibold text-gray-200">What do you need a comeback for?</Label>
              <Textarea
                id="input"
                placeholder="Enter the text you want to respond to..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-24 border-2 border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-lg font-semibold text-gray-200">Response Type</Label>
              <div className="grid grid-cols-3 gap-2">
                {responseTypes.map((type) => (
                  <Button
                    key={type}
                    variant={responseType === type ? "default" : "outline"}
                    onClick={() => setResponseType(type)}
                    className={`transition-all duration-200 ${
                      responseType === type
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-gray-800 text-gray-200 hover:bg-gray-700 border-gray-600"
                    }`}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-lg font-semibold text-gray-200">Spicy Level</Label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[spicyLevel]}
                  onValueChange={(value) => setSpicyLevel(value[0])}
                  max={10}
                  step={1}
                  className="flex-grow"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.5, 0.8, 1],
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                >
                  <Flame className={`w-10 h-10 ${
                    spicyLevel === 0 ? 'text-green-500' :
                    spicyLevel <= 3 ? 'text-yellow-500' :
                    spicyLevel <= 6 ? 'text-orange-500' :
                    spicyLevel <= 8 ? 'text-red-500' :
                    'text-red-600'
                  }`} />
                </motion.div>
                <span className="text-2xl font-bold text-gray-200">{spicyLevel}</span>
              </div>
            </div>
            
            <Button
              onClick={generateComeback}
              disabled={loading || !input}
              className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Zap className="mr-2 h-5 w-5" />
              )}
              Generate Comeback
            </Button>
            
            <AnimatePresence>
              {comeback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 p-4 bg-gray-800 rounded-lg border-2 border-indigo-500 relative"
                >
                  <p className="text-gray-200 text-lg pr-10">{comeback}</p>
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <Button
                      onClick={copyToClipboard}
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full"
                      variant="ghost"
                    >
                      {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-gray-300" />}
                    </Button>
                    <Button
                      onClick={generateComeback}
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full"
                      variant="ghost"
                    >
                      <RefreshCw className="h-5 w-5 text-gray-300" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}