import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";



export function Home() {


  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Hola a todos</CardTitle>
          <CardDescription>Esta es una tarjeta</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Lorem ipum dolor sit amet consectetur adipisicing elit. Quisquam, quod.</p>
        </CardContent>
        <CardFooter>
          <Button variant={'ghost'}>
            Click me s
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
