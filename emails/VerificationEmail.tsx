import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

import * as React from "react";

interface OtpEmailProps {
  name: string;
  otp: string;
}

const verificationEmail = ({ name, otp }: OtpEmailProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className="bg-white my-auto mx-auto font-sans">
        
        {/* Preview Text */}
        <Text className="hidden">
          Your verification code is {otp}
        </Text>

        <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-full max-w-[465px]">
          
          <Heading className="text-black text-[24px] font-normal text-center my-[30px]">
            Verify your account
          </Heading>

          <Text className="text-black text-[14px] leading-[24px] text-center">
            Hello {name}, please use the following OTP to verify your account:
          </Text>

          <Section className="bg-slate-100 rounded-md my-[32px] py-[12px] px-[10px]">
            <Text className="text-black text-[32px] font-bold tracking-[6px] leading-[40px] text-center m-0">
              {otp}
            </Text>
          </Section>

          <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
            This code expires in 10 minutes. If you didn't request this email,
            you can safely ignore it.
          </Text>

        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default verificationEmail;