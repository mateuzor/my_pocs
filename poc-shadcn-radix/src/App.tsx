import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function App() {
  const [showArchived, setShowArchived] = useState(false);
  const [name, setName] = useState('Ada');

  return (
    <TooltipProvider delayDuration={200}>
      <main className="mx-auto max-w-2xl space-y-10 p-8">
        <h1 className="text-2xl font-bold">Shadcn-style components on Radix</h1>

        <section className="space-y-3">
          <h2 className="font-semibold">Button (cva variants)</h2>
          <div className="flex flex-wrap gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="ghost">Ghost</Button>
            {/* asChild: link semantics with button styling */}
            <Button asChild variant="link"><a href="https://ui.shadcn.com" target="_blank" rel="noreferrer">Docs</a></Button>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Dialog (focus trap, Esc, aria)</h2>
          <Dialog>
            <DialogTrigger asChild><Button variant="outline">Edit profile</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>Change your display name. Press Esc or click outside to close.</DialogDescription>
              </DialogHeader>
              <input className="h-10 rounded-md border bg-background px-3 text-sm" value={name} onChange={(e) => setName(e.target.value)} aria-label="Name" />
              <DialogFooter>
                <DialogClose asChild><Button>Save ({name})</Button></DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">DropdownMenu (arrow keys, typeahead)</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="outline">Open menu</Button></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => alert('Profile')}>Profile</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => alert('Billing')}>Billing</DropdownMenuItem>
              <DropdownMenuCheckboxItem checked={showArchived} onCheckedChange={setShowArchived}>Show archived</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Tabs</h2>
          <Tabs defaultValue="account">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">Account settings{showArchived ? ' (archived visible)' : ''}.</TabsContent>
            <TabsContent value="password">Password settings.</TabsContent>
          </Tabs>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Tooltip (hover or focus)</h2>
          <Tooltip>
            <TooltipTrigger asChild><Button variant="secondary">Hover or Tab to me</Button></TooltipTrigger>
            <TooltipContent>Tooltips are keyboard accessible</TooltipContent>
          </Tooltip>
        </section>
      </main>
    </TooltipProvider>
  );
}
