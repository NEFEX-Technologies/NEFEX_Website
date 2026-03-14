const db = require('./database');

const jobsToSeed = [
    {
        title: "AWS Data Engineer",
        experience: "2-3 Years Experience",
        location: "Remote",
        description: "Design and build scalable data pipelines using AWS services. Work with S3, Glue, EMR, Redshift, and Lambda to transform raw data into actionable insights. Collaborate with cross-functional teams to deliver data-driven solutions.",
        skills_data: JSON.stringify([
            { name: 'Core AWS Services', skills: ['Amazon S3', 'AWS Glue', 'Amazon EMR', 'Amazon Athena', 'AWS Lake Formation', 'AWS Glue Data Catalog', 'Amazon MWAA', 'AWS Step Functions'] },
            { name: 'Programming & Scripting', skills: ['Python', 'SQL', 'PySpark', 'Apache Spark'] },
            { name: 'ETL & Data Cleansing', skills: ['Data Lake Architecture', 'Medallion Architecture (Bronze / Silver / Gold)', 'RDBMS → Data Lake Migration (MS SQL / Oracle)', 'Metadata-Driven Pipeline Frameworks', 'Data Modeling', 'Slowly Changing Dimensions (SCD Type 1 / 2 / 3)', 'Data Quality & Validation', 'Data Transformation & Optimization'] },
            { name: 'Other Skills', skills: ['Apache Iceberg / Delta Lake / Apache Hudi', 'Infrastructure as Code (Terraform / CloudFormation)', 'CI/CD for Data Pipelines (GitLab CI / Jenkins / CodePipeline)', 'AWS Cost Optimization', 'Partitioning & Query Performance Optimization', 'Data Governance & Cataloging'] }
        ])
    },
    {
        title: "Data Engineer (Azure)",
        experience: "2-3 Years Experience",
        location: "Remote",
        description: "Build robust data solutions on Azure platform. Work with Azure Data Factory, Databricks, Synapse Analytics, and Azure Data Lake. Optimize data workflows and ensure high-performance data processing at scale.",
        skills_data: JSON.stringify([
            { name: 'Core Azure Services', skills: ['Azure Data Factory', 'Azure Synapse Analytics', 'Azure Databricks', 'Azure Data Lake', 'Azure SQL', 'Azure Functions', 'Event Hubs'] },
            { name: 'Programming & Scripting', skills: ['Python', 'SQL', 'PySpark', 'PowerShell', 'Scala'] },
            { name: 'ETL & Data Processing', skills: ['Apache Spark', 'ADF Pipelines', 'Data Warehousing', 'Delta Lake', 'Stream Processing'] },
            { name: 'Additional Skills', skills: ['Git', 'Azure DevOps', 'ARM Templates', 'Data Modeling', 'Power BI'] }
        ])
    },
    {
        title: "Power BI Analyst",
        experience: "1+ Year Experience",
        location: "Remote",
        description: "Create compelling data visualizations and interactive dashboards. Transform complex datasets into actionable business insights. Work closely with stakeholders to understand requirements and deliver impactful BI solutions.",
        skills_data: JSON.stringify([
            { name: 'Core BI Skills', skills: ['Power BI Desktop', 'Power BI Service', 'DAX', 'Power Query (M)', 'Data Modeling', 'Report Design'] },
            { name: 'Data Analysis', skills: ['SQL', 'Excel', 'Statistical Analysis', 'Data Visualization', 'KPI Development'] },
            { name: 'Technical Skills', skills: ['Row-Level Security', 'Gateway Configuration', 'API Integration', 'Custom Visuals', 'Dataflows'] },
            { name: 'Business & Communication', skills: ['Stakeholder Management', 'Requirements Gathering', 'Dashboard Best Practices', 'Storytelling with Data'] }
        ])
    }
];

async function seed() {
    try {
        // Wait briefly for the pool to initialize
        await new Promise(r => setTimeout(r, 1000));

        await db.query(`DELETE FROM jobs`);
        console.log("Deleted existing jobs...");

        for (let job of jobsToSeed) {
            await db.query(
                `INSERT INTO jobs (title, location, experience, description, skills_data, is_active) VALUES ($1, $2, $3, $4, $5, true)`,
                [job.title, job.location, job.experience, job.description, job.skills_data]
            );
        }
        console.log("Restored original 3 jobs into the Neon Postgres database!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding databases:", error);
        process.exit(1);
    }
}

seed();
