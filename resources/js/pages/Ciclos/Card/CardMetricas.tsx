import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatoPesos } from '@/lib/fomato_numeros';
export default function CardMetricas({ title, Icon, count, amount, color = "gray" }) {
  return (
<Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                            <div className={`p-2 rounded-lg "bg-green-100"`}>
                                {Icon && <Icon className={`h-4 w-4 text-${color}-600`} />}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{count}</div>
                            <p className="text-xs text-muted-foreground mt-1">{formatoPesos(amount)}</p>
                        </CardContent>
                    </Card>
  )}
