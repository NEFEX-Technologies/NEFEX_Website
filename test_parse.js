const skillsRaw = `Core AWS Services :

Amazon S3

AWS Glue

Amazon EMR

Amazon Athena

AWS Lake Formation

AWS Glue Data Catalog

Amazon MWAA

AWS Step Functions

Programming & Scripting :

Python

PySpark

Apache Spark

SQL

ETL & Data Cleansing :

Data Lake Architecture

Medallion Architecture (Bronze / Silver / Gold)

RDBMS → Data Lake Migration (MS SQL / Oracle)

Metadata-Driven Pipeline Frameworks

Data Modeling (Star Schema, Snowflake Schema, Data Vault)

Slowly Changing Dimensions (SCD Type 1 / 2 / 3)

Data Quality & Validation

Data Transformation & Optimization

Other Skills :

Apache Iceberg / Delta Lake / Apache Hudi

Infrastructure as Code (Terraform / CloudFormation)

CI/CD for Data Pipelines (GitLab CI / Jenkins / CodePipeline)

AWS Cost Optimization

Partitioning & Query Performance Optimization

Data Governance & Cataloging`;

let skillsJson = null;

if (skillsRaw.trim() !== '') {
    const categories = [];
    let currentCategory = null;

    const lines = skillsRaw.split('\n');
    lines.forEach(line => {
        const text = line.trim();
        if (!text) return; // Skip empty lines

        // If line ends with a colon, or contains one but no commas, we treat it as a header
        if (text.endsWith(':') || (text.includes(':') && !text.includes(','))) {
            const name = text.replace(':', '').trim();
            currentCategory = { name: name, skills: [] };
            categories.push(currentCategory);
        }
        // Alternatively, if there's no colon but we don't have a category yet, make a default one
        else if (!currentCategory && !text.includes(':')) {
            currentCategory = { name: 'Skills', skills: [] };
            categories.push(currentCategory);

            // Add comma separated items or single items
            const skills = text.split(/,|\n/).map(s => s.trim()).filter(s => s);
            currentCategory.skills.push(...skills);
        }
        // If it has a colon and comma, it might be the old "Header: skill, skill" format
        else if (text.includes(':') && text.includes(',')) {
            const parts = text.split(':');
            const name = parts[0].trim();
            const skills = parts[1].split(',').map(s => s.trim()).filter(s => s !== '');
            categories.push({ name, skills });
            currentCategory = categories[categories.length - 1]; // update pointer
        }
        // Otherwise it's a skill line belonging to the current category
        else {
            if (!currentCategory) {
                currentCategory = { name: 'Skills', skills: [] };
                categories.push(currentCategory);
            }
            const skills = text.split(/,|\n/).map(s => s.trim()).filter(s => s);
            currentCategory.skills.push(...skills);
        }
    });

    if (categories.length > 0) {
        skillsJson = JSON.stringify(categories, null, 2);
    }
}

console.log(skillsJson);
