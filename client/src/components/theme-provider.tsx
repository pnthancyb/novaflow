import { useTheme } from "@/hooks/use-theme";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: "dark" | "light";
};

export function ThemeProvider({ children, defaultTheme = "light" }: ThemeProviderProps) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {children}
    </div>
  );
}

export { useTheme };
