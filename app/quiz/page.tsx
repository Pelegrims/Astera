import { Container } from "@/components/ui/Container";
import { QuizForm } from "@/components/quiz/QuizForm";

export const metadata = {
  title: "Start your reading — Astera",
};

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-quiz-glow py-16 sm:py-24">
      <Container width="sm">
        <QuizForm />
      </Container>
    </main>
  );
}
