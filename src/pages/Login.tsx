
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { toast } = useToast();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loginErrors, setLoginErrors] = useState({
    email: "",
    password: "",
    form: "",
  });

  const [registerErrors, setRegisterErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    form: "",
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    // Clear error when user types
    if (loginErrors[name as keyof typeof loginErrors]) {
      setLoginErrors({ ...loginErrors, [name]: "" });
    }
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
    // Clear error when user types
    if (registerErrors[name as keyof typeof registerErrors]) {
      setRegisterErrors({ ...registerErrors, [name]: "" });
    }
  };

  const validateLoginForm = () => {
    const errors = {
      email: /^\S+@\S+\.\S+$/.test(loginData.email) ? "" : "Valid email is required",
      password: loginData.password.length >= 6 ? "" : "Password must be at least 6 characters",
      form: "",
    };

    setLoginErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const validateRegisterForm = () => {
    const errors = {
      name: registerData.name ? "" : "Name is required",
      email: /^\S+@\S+\.\S+$/.test(registerData.email) ? "" : "Valid email is required",
      password: registerData.password.length >= 6 ? "" : "Password must be at least 6 characters",
      confirmPassword: registerData.password === registerData.confirmPassword ? "" : "Passwords don't match",
      form: "",
    };

    setRegisterErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateLoginForm()) {
      return;
    }

    try {
      await login(loginData.email, loginData.password);
      
      toast({
        title: "Login Successful",
        description: "You are now logged in",
      });
      
      navigate("/");
    } catch (error) {
      setLoginErrors({
        ...loginErrors,
        form: "Invalid email or password",
      });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRegisterForm()) {
      return;
    }

    try {
      await register(registerData.name, registerData.email, registerData.password);
      
      toast({
        title: "Registration Successful",
        description: "You are now registered and logged in",
      });
      
      navigate("/");
    } catch (error) {
      setRegisterErrors({
        ...registerErrors,
        form: "Registration failed. Please try again.",
      });
    }
  };

  // For demo - Admin login
  const handleAdminLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    await login("admin@example.com", "admin123");
    toast({
      title: "Admin Login Successful",
      description: "You are now logged in as an admin",
    });
    navigate("/admin");
  };

  return (
    <div className="container px-4 mx-auto py-10">
      <div className="max-w-md mx-auto">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login to Your Account</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLoginSubmit}>
                <CardContent className="space-y-4">
                  {loginErrors.form && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                      {loginErrors.form}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      placeholder="your.email@example.com"
                    />
                    {loginErrors.email && <p className="text-sm text-blood-600">{loginErrors.email}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <a href="#" className="text-xs text-blood-600 hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="••••••••"
                    />
                    {loginErrors.password && <p className="text-sm text-blood-600">{loginErrors.password}</p>}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button type="submit" className="w-full bg-blood-600 hover:bg-blood-700">
                    Login
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full border-blood-600 text-blood-600"
                    onClick={handleAdminLogin}
                  >
                    Demo Admin Login
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>
                  Register to donate blood and save lives
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleRegisterSubmit}>
                <CardContent className="space-y-4">
                  {registerErrors.form && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                      {registerErrors.form}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label htmlFor="register-name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="register-name"
                      name="name"
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      placeholder="Your full name"
                    />
                    {registerErrors.name && <p className="text-sm text-blood-600">{registerErrors.name}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="register-email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      placeholder="your.email@example.com"
                    />
                    {registerErrors.email && <p className="text-sm text-blood-600">{registerErrors.email}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="register-password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="register-password"
                      name="password"
                      type="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      placeholder="••••••••"
                    />
                    {registerErrors.password && <p className="text-sm text-blood-600">{registerErrors.password}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="register-confirm-password" className="text-sm font-medium">
                      Confirm Password
                    </label>
                    <Input
                      id="register-confirm-password"
                      name="confirmPassword"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      placeholder="••••••••"
                    />
                    {registerErrors.confirmPassword && <p className="text-sm text-blood-600">{registerErrors.confirmPassword}</p>}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-blood-600 hover:bg-blood-700">
                    Register
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
