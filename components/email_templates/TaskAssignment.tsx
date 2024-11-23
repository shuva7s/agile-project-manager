import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
} from "@react-email/components";

export const TaskAssignment = ({
  recipients,
  projectName,
  projectId,
  taskName,
  taskId,
  taskDescription,
  weightage,
}: {
  recipients: string[];
  projectName: string;
  projectId: string;
  taskName: string;
  taskId: string;
  taskDescription: string;
  weightage: number;
}) => (
  <Html>
    <Head />
    <Body
      style={{
        fontFamily: "Arial, sans-serif",
        margin: 0,
        padding: 0,
        backgroundColor: "#f5f7fa",
        color: "#333",
      }}
    >
      <Container
        style={{
          maxWidth: "600px",
          margin: "20px auto",
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header Section */}
        <Section
          style={{
            backgroundColor: "#0F63FF",
            color: "#ffffff",
            padding: "15px",
            borderRadius: "8px 8px 0 0",
          }}
        >
          <Text
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              margin: 0,
              lineHeight: "1.5",
              letterSpacing: "0.5px",
            }}
          >
            Task Assignment Notification
          </Text>
          <Text
            style={{
              fontSize: "14px",
              margin: "5px 0 0",
              color: "#cce3ff",
            }}
          >
            Project: {projectName}
          </Text>
        </Section>

        {/* Task Details Section */}
        <Section style={{ padding: "20px" }}>
          <Text
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Hello!
          </Text>
          <Text style={{ margin: "0 0 10px" }}>
            You have been assigned a new task in the{" "}
            <strong>{projectName}</strong> project.
          </Text>
          <Text style={{ margin: "0 0 10px" }}>
            <strong>Task Name:</strong> {taskName}
          </Text>
          <Text style={{ margin: "0 0 10px" }}>
            <strong>Description:</strong> {taskDescription}
          </Text>
          <Text style={{ margin: "0 0 10px" }}>
            <strong>Weightage:</strong> {weightage}
          </Text>

          <Button
            href={`https://agile-project-manager.vercel.app/tasks`}
            style={{
              backgroundColor: "#0F63FF",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "5px",
              textDecoration: "none",
              fontWeight: "bold",
              display: "inline-block",
              marginTop: "20px",
            }}
          >
            View Task
          </Button>
        </Section>

        {/* Footer Section */}
        <Section
          style={{
            marginTop: "20px",
            padding: "15px",
            borderTop: "1px solid #eaeaea",
            textAlign: "center",
            fontSize: "12px",
            color: "#888",
          }}
        >
          <Text style={{ margin: "0 0 5px" }}>
            &copy; 2024 Your Company Name. All Rights Reserved.
          </Text>
          <Text style={{ margin: "0" }}>
            <a
              href="https://agile-project-manager.vercel.app"
              style={{ color: "#0F63FF", textDecoration: "none" }}
            >
              Visit Our Website
            </a>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
