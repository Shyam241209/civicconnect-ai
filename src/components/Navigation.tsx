import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Flag, Home, FileText, LayoutDashboard, Info, Map as MapIcon, LogOut, ShieldCheck } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/lib/translations";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Navigation = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flag className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">CivicAI</span>
              <span className="text-xs text-muted-foreground">स्वच्छ भारत</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-2">
            {!user ? (
              <>
                <Button 
                  variant={isActive("/") ? "default" : "ghost"} 
                  asChild
                >
                  <Link to="/">
                    <Home className="w-4 h-4 mr-2" />
                    {t("home")}
                  </Link>
                </Button>
                <Button 
                  variant={isActive("/how-it-works") ? "default" : "ghost"} 
                  asChild
                >
                  <Link to="/how-it-works">
                    <Info className="w-4 h-4 mr-2" />
                    {t("howItWorks")}
                  </Link>
                </Button>
                <Button variant="default" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              </>
            ) : role === "admin" ? (
              <>
                <Button 
                  variant={isActive("/admin") ? "default" : "ghost"} 
                  asChild
                >
                  <Link to="/admin">
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Admin Dashboard
                  </Link>
                </Button>
                <Button 
                  variant={isActive("/map") ? "default" : "ghost"} 
                  asChild
                >
                  <Link to="/map">
                    <MapIcon className="w-4 h-4 mr-2" />
                    {t("mapView")}
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant={isActive("/report") ? "default" : "ghost"} 
                  asChild
                >
                  <Link to="/report">
                    <FileText className="w-4 h-4 mr-2" />
                    {t("reportIssue")}
                  </Link>
                </Button>
                <Button 
                  variant={isActive("/dashboard") ? "default" : "ghost"} 
                  asChild
                >
                  <Link to="/dashboard">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    {t("viewDashboard")}
                  </Link>
                </Button>
                <Button 
                  variant={isActive("/map") ? "default" : "ghost"} 
                  asChild
                >
                  <Link to="/map">
                    <MapIcon className="w-4 h-4 mr-2" />
                    {t("mapView")}
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
            <LanguageSelector />
          </div>
          
          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSelector />
            {!user ? (
              <Button size="sm" variant="default" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            ) : role === "admin" ? (
              <Button size="sm" variant="outline" asChild>
                <Link to="/admin">Dashboard</Link>
              </Button>
            ) : (
              <Button size="sm" variant="outline" asChild>
                <Link to="/report">{t("reportIssue")}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
