import { Stack, Construct, StackProps } from '@aws-cdk/cdk';
import { HostedZoneProvider, AliasRecord } from '@aws-cdk/aws-route53';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { CloudFrontWebDistribution } from '@aws-cdk/aws-cloudfront';

const CLOUDFRONT_ZONE_ID = 'Z2FDTNDATAQYW2'; // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-aliastarget.html#cfn-route53-aliastarget-hostedzoneid

interface WebsiteStackProps extends StackProps {
  readonly domain: string;
  readonly assetPath: string;
}

export class WebsiteStack extends Stack {
  constructor(scope: Construct, id: string, props: WebsiteStackProps) {
    super(scope, id, props);

    const { domain, assetPath } = props;

    const hostedZone = new HostedZoneProvider(this, {
      domainName: domain
    }).findAndImport(this, 'HostedZone');

    const siteCertificate = new Certificate(this, 'SiteCertificate', {
      domainName: domain,
      subjectAlternativeNames: [domain]
    });

    const siteBucket = new Bucket(this, 'SiteBucket', {
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html'
    });

    new BucketDeployment(this, 'SiteDeployment', {
      source: Source.asset(assetPath),
      destinationBucket: siteBucket
    });

    const siteDistribution = new CloudFrontWebDistribution(this, 'SiteDistribution', {
      aliasConfiguration: {
        acmCertRef: siteCertificate.certificateArn,
        names: [domain]
      },
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: siteBucket
          },
          behaviors: [
            {
              isDefaultBehavior: true
            }
          ]
        }
      ]
    });

    new AliasRecord(this, 'SiteAlias', {
      zone: hostedZone,
      recordName: `${domain}.`,
      target: {
        asAliasRecordTarget: () => {
          return {
            hostedZoneId: CLOUDFRONT_ZONE_ID,
            dnsName: siteDistribution.domainName
          };
        }
      }
    });
  }
}
