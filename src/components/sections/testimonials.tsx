import feedbacksData from "@/data/feedbacks.json"
import type { Feedback } from "@/types"
import { TestimonialsClient } from "@/components/sections/testimonials-client"

const feedbacks: Feedback[] = (feedbacksData as Feedback[]).sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
)

export function Testimonials() {
  return <TestimonialsClient feedbacks={feedbacks} />
}
