import { useTheme } from "@/hooks/use-theme";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: "dark" | "light" | "system";
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "github-readme-theme",
}: ThemeProviderProps) {
  return (
    <ThemeProviderInner
      defaultTheme={defaultTheme}
      storageKey={storageKey}
    >
      {children}
    </ThemeProviderInner>
  );
}

function ThemeProviderInner({ children, defaultTheme, storageKey }: ThemeProviderProps) {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme}`}>
      {children}
    </div>
  );
}

export { useTheme };
