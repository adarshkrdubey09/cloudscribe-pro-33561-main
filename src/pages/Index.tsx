import { NotebookLayout } from "@/components/NotebookLayout";

interface IndexProps {
  onLogout: () => void;
}

const Index = ({ onLogout }: IndexProps) => {
  return <NotebookLayout onLogout={onLogout} />;
};

export default Index;
