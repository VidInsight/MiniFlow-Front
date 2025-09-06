import { cn } from "@/lib/utils";

export const PageHeader = ({ 
  title, 
  description, 
  icon: Icon, 
  actions, 
  className,
  children 
}) => {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl bg-gradient-to-r from-card/80 via-card/60 to-card/40 backdrop-blur-sm border border-border/50 shadow-xl",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>
      <div className="relative p-8">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {Icon && (
                <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-glow">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {title}
                </h1>
                {description && (
                  <p className="text-muted-foreground text-lg mt-2">
                    {description}
                  </p>
                )}
              </div>
            </div>
            {children}
          </div>
          {actions && (
            <div className="flex gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};