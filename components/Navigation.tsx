'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Logo } from './logo';

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const routes = [
    { name: 'Dashboard', path: '/' },
    { name: 'SQL', path: '/sql' },
    { name: 'ETL', path: '/etl' },
  ];

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className='w-full border-b top-0 sticky bg-primary-foreground z-20'>
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          <a className='flex items-center' href='/'>
            <Logo />
          </a>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-4'>
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActivePath(route.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {route.name}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className='md:hidden'>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant='outline' size='icon'>
                  <Menu className='h-6 w-6' />
                </Button>
              </SheetTrigger>
              <SheetContent side='right'>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className='flex flex-col space-y-3 mt-4'>
                  {routes.map((route) => (
                    <Link
                      key={route.path}
                      href={route.path}
                      onClick={() => setOpen(false)}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        isActivePath(route.path)
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      {route.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
