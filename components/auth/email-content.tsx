//todo: EmailContent được call từ Resend, nghĩa là call từ server, vì vậy EmailContent không được là use client component
import React from "react";
import { Html, Text, Link, Heading, Button } from "@react-email/components";
interface EmailContentProps {
  name: string;
  email: string;
  urlVerification: string;
}
const EmailContent = ({ name, email, urlVerification }: EmailContentProps) => {
  return (
    <Html>
      <Heading as="h2">Xin Chào {name}</Heading>
      <Text>Email: {email}</Text>
      <Text>
        Click
        <Link href={urlVerification}> tại đây</Link> để thực hiện xác thực người
        dùng.
      </Text>
    </Html>
  );
};

export default EmailContent;
