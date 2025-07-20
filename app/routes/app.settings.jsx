import { Form, useLoaderData, useActionData } from "@remix-run/react";
import {
  Box,
  Card,
  Page,
  Text,
  BlockStack,
  InlineGrid,
  TextField,
  Button,
} from "@shopify/polaris";
import { useState, useEffect } from "react";
import { json } from "@remix-run/node";


// import prisma db
import db from "../db.server"

export async function loader() {
  let settings = await db.settings.findFirst();
  console.log("settings------------------------->", settings);
  return json(settings);
}

export async function action({ request }) {
  const formData = await request.formData();
  const settings = Object.fromEntries(formData);

  await db.settings.upsert({
    where: {
      id: "1"
    },
    update: {
      id: "1",
      name : settings.name,
      description : settings.description
    },
    create: {
      id: "1",
      name: settings.name,
      description: settings.description
    }
  })
  // Save to DB logic here...
  return json(settings);
}


export default function SettingsPage() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [formState, setFormState] = useState(loaderData);

  useEffect(() => {
    if (actionData) {
      setFormState(actionData);
    }
  }, [actionData]);

  return (
    <Page
      divider
      primaryAction={{ content: "View on your store", disabled: true }}
      secondaryActions={[
        {
          content: "Duplicate",
          accessibilityLabel: "Secondary action label",
          onAction: () => alert("Duplicate action"),
        },
      ]}
    >
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Settings
              </Text>
              <Text as="p" variant="bodyMd">
                Update app Settings and preferences.
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <Form method="POST">
              <BlockStack gap="400">
                <TextField
                  label="Title"
                  name="name"
                  value={formState?.name}
                  onChange={(value) =>
                    setFormState({ ...formState, name: value })
                  }
                />
                <TextField
                  label="description"
                  name="description"
                  value={formState?.description}
                  onChange={(value) =>
                    setFormState({ ...formState, description: value })
                  }
                />
                <Button submit>Save</Button>
              </BlockStack>
            </Form>
          </Card>
        </InlineGrid>
      </BlockStack>
    </Page>
  );
}
