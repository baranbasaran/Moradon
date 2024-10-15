package com.baranbasaran.cheaperbook.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.core.sync.RequestBody;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.UUID;
import java.nio.file.Files;

@Service
public class MediaService {

    private final S3Client s3Client;
    private final String bucketName;

    public MediaService(
            @Value("${aws.s3.bucket.name}") String bucketName,
            @Value("${aws.region}") String region,
            @Value("${aws.access.key}") String accessKey,
            @Value("${aws.secret.key}") String secretKey
    ) {
        this.bucketName = bucketName;

        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKey, secretKey);
        this.s3Client = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .build();
    }

    // Upload media file to S3
    public String upload(MultipartFile file) {
        String fileName = generateFileName(file.getOriginalFilename());

        try {
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(fileName)
                            .build(),
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize())
            );
        } catch (S3Exception | IOException e) {
            throw new RuntimeException("Error uploading file to S3", e);
        }

        return getFileUrl(fileName);
    }

    // Fetch file from S3 and return as byte array
    public byte[] download(String fileName) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .build();
            return s3Client.getObject(getObjectRequest).readAllBytes();
        } catch (S3Exception | IOException e) {
            throw new RuntimeException("Error downloading file from S3", e);
        }
    }

    // Generate unique file name
    private String generateFileName(String originalFileName) {
        return UUID.randomUUID().toString() + "_" + originalFileName;
    }

    // Get the public URL of the file
    private String getFileUrl(String fileName) {
        return String.format("https://%s.s3.amazonaws.com/%s", bucketName, fileName);
    }
}
