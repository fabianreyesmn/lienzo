import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center justify-center text-center">
        <Logo className="h-16 w-16 mb-4 text-primary-foreground fill-current" />
        <h1 className="text-5xl font-headline font-bold">Lienzo</h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          Un santuario digital para la palabra escrita.
        </p>
      </div>

      <Tabs defaultValue="login" className="w-full max-w-sm mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
          <TabsTrigger value="register">Registrarse</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <form>
              <CardHeader>
                <CardTitle className="font-headline">Bienvenido de vuelta</CardTitle>
                <CardDescription>
                  Accede a tu escritorio para continuar tu obra.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">Email</Label>
                  <Input id="email-login" type="email" placeholder="email@ejemplo.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login">Contraseña</Label>
                  <Input id="password-login" type="password" required />
                </div>
                <Link href="/dashboard" passHref legacyBehavior>
                  <Button type="submit" className="w-full">
                    Entrar
                  </Button>
                </Link>
              </CardContent>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card>
            <form>
              <CardHeader>
                <CardTitle className="font-headline">Crea tu cuenta</CardTitle>
                <CardDescription>
                  Empieza tu viaje como escritor en un solo paso.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name-register">Nombre</Label>
                  <Input id="name-register" placeholder="Tu nombre" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-register">Email</Label>
                  <Input id="email-register" type="email" placeholder="email@ejemplo.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-register">Contraseña</Label>
                  <Input id="password-register" type="password" required />
                </div>
                <Link href="/dashboard" passHref legacyBehavior>
                  <Button type="submit" className="w-full">
                    Crear Cuenta
                  </Button>
                </Link>
              </CardContent>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
