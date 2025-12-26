"use client";

import React from 'react';
import { Shield, User, Users, Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type RoleType = 'admin' | 'affiliate' | 'property_manager';

interface Role {
    id: RoleType;
    name: string;
    description: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
}

const roles: Role[] = [
    {
        id: 'admin',
        name: 'Administrator',
        description: 'Full system control & user management.',
        icon: Shield,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
    },
    {
        id: 'property_manager',
        name: 'Property Manager',
        description: 'Manage listings, deals & coordinate with affiliate partners.',
        icon: User,
        color: 'text-slate-400',
        bgColor: 'bg-slate-500/10',
        borderColor: 'border-slate-500/20',
    },
    {
        id: 'affiliate',
        name: 'Affiliate Partner',
        description: 'Refer properties & recommend management partners.',
        icon: Users,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/20',
    },
];

interface PermissionSelectorProps {
    currentRole: RoleType;
    onRoleChange: (role: RoleType) => void;
}

export function PermissionSelector({ currentRole, onRoleChange }: PermissionSelectorProps) {
    return (
        <div className="mt-auto mb-4 px-3 py-4 mx-4 rounded-2xl border border-border bg-card/50 backdrop-blur-md shadow-2xl overflow-hidden group relative">
            {/* Subtle Gradient Background Effect */}
            <div className="absolute -inset-24 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-5 px-1">
                    <div className="p-1 rounded-md bg-white/10 border border-white/10">
                        <Shield className="w-3.5 h-3.5 text-secondary" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-secondary/80">
                        Simulated Security Clearance
                    </span>
                </div>

                <div className="relative space-y-4">
                    {/* Central Vertical Track */}
                    <div className="absolute left-[17px] top-6 bottom-6 w-[2px] bg-muted/50 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "absolute top-0 w-full bg-gradient-to-b from-blue-500 via-emerald-500 to-transparent transition-all duration-1000 ease-in-out",
                                currentRole === 'admin' ? "h-full" : currentRole === 'affiliate' ? "h-2/3" : "h-1/3"
                            )}
                        />
                    </div>

                    {roles.map((role) => {
                        const isActive = role.id === currentRole;

                        return (
                            <button
                                key={role.id}
                                onClick={() => onRoleChange(role.id)}
                                className="relative flex items-center gap-4 w-full text-left group/role transition-transform active:scale-95 outline-none"
                            >
                                <div className={cn(
                                    "relative z-10 w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-500 ease-out",
                                    isActive
                                        ? cn(role.bgColor, role.borderColor, "scale-110 shadow-lg border-white/20")
                                        : "bg-muted/50 border-border opacity-40 grayscale-[0.8] group-hover/role:opacity-100 group-hover/role:grayscale-0 group-hover/role:bg-muted"
                                )}>
                                    <role.icon className={cn(
                                        "w-4.5 h-4.5 transition-all duration-500",
                                        isActive ? role.color : "text-secondary group-hover/role:text-foreground"
                                    )} />

                                    {isActive && (
                                        <div className={cn(
                                            "absolute -inset-1 rounded-xl animate-pulse opacity-10",
                                            role.bgColor
                                        )} />
                                    )}
                                </div>

                                <div className={cn(
                                    "flex-1 transition-all duration-500",
                                    !isActive && "opacity-40 group-hover/role:opacity-80"
                                )}>
                                    <div className="flex items-center gap-2">
                                        <h4 className={cn(
                                            "text-xs font-bold tracking-tight transition-colors duration-500",
                                            isActive ? "text-foreground font-black" : "text-secondary group-hover/role:text-foreground"
                                        )}>
                                            {role.name}
                                        </h4>
                                        {isActive && (
                                            <div className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[9px] text-secondary/60 leading-tight mt-0.5 font-medium italic">
                                        {role.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[8px] font-bold text-secondary uppercase tracking-widest leading-none">Simulation mode active</span>
                    </div>
                    <Info className="w-3 h-3 text-secondary/40" />
                </div>
            </div>
        </div>
    );
}
