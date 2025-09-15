import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-accent/5">
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        <div className="min-h-[80vh] flex items-center justify-center">
          <Card className="max-w-md w-full shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="text-6xl font-bold text-muted-foreground mb-4">404</div>
              <h1 className="text-2xl font-bold mb-4">Sayfa Bulunamadı</h1>
              <p className="text-muted-foreground mb-6">
                Aradığınız sayfa mevcut değil veya taşınmış olabilir.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Geri Dön
                </Button>
                <Button 
                  onClick={() => navigate("/")}
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Ana Sayfaya Git
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
