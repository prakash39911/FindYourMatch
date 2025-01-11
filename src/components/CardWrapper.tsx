import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@nextui-org/react";
import React, { ReactNode } from "react";
import { IconType } from "react-icons/lib";

type Props = {
  body?: ReactNode;
  headerIcon: IconType;
  headerText: string;
  subHeadertext?: string;
  action?: () => void;
  actionLabel?: string;
  footer?: ReactNode;
};

export default function CardWrapper({
  body,
  headerIcon: Icon,
  headerText,
  subHeadertext,
  action,
  actionLabel,
  footer,
}: Props) {
  return (
    <div
      className="flex justify-center items-center"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <Card className="w-2/6 p-5">
        <CardHeader className="flex justify-center flex-col gap-0.5">
          <div className="flex gap-2 items-center">
            <Icon size={25} />
            <div className="font-bold text-2xl">{headerText}</div>
          </div>
          {subHeadertext && <p className="text-sm">{subHeadertext}</p>}
        </CardHeader>
        {body && <CardBody>{body}</CardBody>}
        <CardFooter>
          {action && (
            <Button
              onPress={action}
              fullWidth
              color="secondary"
              variant="bordered"
            >
              {actionLabel}
            </Button>
          )}
          {footer && <>{footer}</>}
        </CardFooter>
      </Card>
    </div>
  );
}
